import { jsPDF } from 'jspdf'
import type Konva from 'konva'
import type { Project, TemplateDef } from '../types'
import { getImageBlob } from './db'
import { coverScale } from './image'
import { resolveOverlay } from './overlay'
import { DPI, MIN_PHOTO_DPI } from './print'

/** Adorno ya cargado y posicionado, listo para dibujar. */
export interface ExportOverlay {
  img: HTMLImageElement
  x: number
  y: number
  width: number
  height: number
}

export interface ExportImages {
  bg: HTMLImageElement
  underlays: ExportOverlay[]
  overlays: ExportOverlay[]
  /** Imágenes ORIGINALES (alta resolución) por hueco. */
  slotImages: Record<string, HTMLImageElement>
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
}

/**
 * Precarga todas las imágenes necesarias para exportar en alta resolución:
 * fondo, adornos y las fotos ORIGINALES de cada hueco (RNF-01). Devuelve un
 * `revoke` para liberar los object URLs al terminar.
 */
export async function prepareExportImages(
  project: Project,
  template: TemplateDef,
): Promise<{ images: ExportImages; revoke: () => void }> {
  const urls: string[] = []
  const loadLayers = (layers: TemplateDef['overlays']) =>
    Promise.all(
      layers.map(async (layer): Promise<ExportOverlay> => {
        const o = resolveOverlay(layer, template.canvas)
        return {
          img: await loadImage(o.src),
          x: o.x,
          y: o.y,
          width: o.width,
          height: o.height,
        }
      }),
    )

  const bg = await loadImage(template.background)
  const underlays = await loadLayers(template.underlays ?? [])
  const overlays = await loadLayers(template.overlays)
  const slotImages: Record<string, HTMLImageElement> = {}
  for (const slot of template.photoSlots) {
    const blobId = project.slots[slot.id]?.imageBlobId
    if (!blobId) continue
    const blob = await getImageBlob(blobId)
    if (!blob) continue
    const url = URL.createObjectURL(blob)
    urls.push(url)
    slotImages[slot.id] = await loadImage(url)
  }
  return {
    images: { bg, underlays, overlays, slotImages },
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  }
}

/** Avisos de fotos que quedarían pixeladas al imprimir (RF-14). */
export function resolutionWarnings(
  project: Project,
  template: TemplateDef,
  slotImages: Record<string, HTMLImageElement>,
): string[] {
  const warnings: string[] = []
  template.photoSlots.forEach((slot, i) => {
    const img = slotImages[slot.id]
    if (!img) return
    const scale = project.slots[slot.id]?.transform.scale ?? 1
    const drawScale =
      coverScale(slot.width, slot.height, img.width, img.height) * scale
    const effectiveDpi = Math.round(DPI / drawScale)
    if (effectiveDpi < MIN_PHOTO_DPI) {
      const label = slot.id.includes('retrato') ? 'Retrato' : `Foto ${i + 1}`
      warnings.push(
        `${label}: ~${effectiveDpi} DPI (recomendado ≥ ${MIN_PHOTO_DPI}). Puede salir pixelada.`,
      )
    }
  })
  return warnings
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** Nombre de archivo seguro a partir del nombre del proyecto. */
export function safeFileName(name: string): string {
  return (
    name
      .trim()
      .replace(/[^\p{L}\p{N}\-_ ]/gu, '')
      .replace(/\s+/g, '-')
      .toLowerCase() || 'recuerdito'
  )
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob()
}

// ---------- Densidad declarada en el archivo ----------
//
// `canvas.toDataURL` no escribe la resolución en ningún sitio: el PNG sale sin
// chunk pHYs y el JPG con densidad JFIF neutra. El conteo de píxeles es
// correcto (1200×1800 = 4×6" a 300 DPI), pero al abrir el archivo cualquier
// programa asume 72 o 96 DPI y anuncia ~12×18 pulgadas. Para quien lleva el
// archivo a un laboratorio y le preguntan «¿está a 300?», eso es la diferencia
// entre poder demostrarlo y no.
//
// Aquí se le inyecta la densidad para que el archivo se describa a sí mismo.

const PX_PER_METER = Math.round(DPI / 0.0254)

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++)
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** Inserta el chunk pHYs tras el IHDR para que el PNG declare los 300 DPI. */
async function pngWithDensity(blob: Blob): Promise<Blob> {
  const src = new Uint8Array(await blob.arrayBuffer())
  // Firma (8) + IHDR: longitud (4) + tipo (4) + 13 de datos + CRC (4) = 33.
  // El IHDR va SIEMPRE primero y siempre mide 13; si no cuadra, no tocamos
  // nada antes que corromper el archivo.
  const dv = new DataView(src.buffer)
  if (src.length < 33 || dv.getUint32(8) !== 13) return blob
  const at = 33

  const chunk = new Uint8Array(21) // 4 long + 4 tipo + 9 datos + 4 crc
  const cv = new DataView(chunk.buffer)
  cv.setUint32(0, 9)
  chunk.set([0x70, 0x48, 0x59, 0x73], 4) // 'pHYs'
  cv.setUint32(8, PX_PER_METER) // px por metro en X
  cv.setUint32(12, PX_PER_METER) // px por metro en Y
  chunk[16] = 1 // unidad: metro
  cv.setUint32(17, crc32(chunk.subarray(4, 17)))

  const out = new Uint8Array(src.length + chunk.length)
  out.set(src.subarray(0, at), 0)
  out.set(chunk, at)
  out.set(src.subarray(at), at + chunk.length)
  return new Blob([out], { type: 'image/png' })
}

/** Pone la densidad en pulgadas en la cabecera JFIF del JPG. */
async function jpgWithDensity(blob: Blob): Promise<Blob> {
  const out = new Uint8Array(await blob.arrayBuffer())
  // SOI (FFD8) + APP0 (FFE0) + longitud (2) + 'JFIF\0' + versión (2),
  // y ahí van unidades y densidades.
  const esJfif =
    out.length > 18 &&
    out[0] === 0xff &&
    out[1] === 0xd8 &&
    out[2] === 0xff &&
    out[3] === 0xe0 &&
    out[6] === 0x4a && // J
    out[7] === 0x46 && // F
    out[8] === 0x49 && // I
    out[9] === 0x46 // F
  if (!esJfif) return blob
  const dv = new DataView(out.buffer)
  out[13] = 1 // unidad: puntos por pulgada
  dv.setUint16(14, DPI)
  dv.setUint16(16, DPI)
  return new Blob([out], { type: 'image/jpeg' })
}

export async function stageToPng(stage: Konva.Stage): Promise<Blob> {
  return pngWithDensity(
    await dataUrlToBlob(
      stage.toDataURL({ pixelRatio: 1, mimeType: 'image/png' }),
    ),
  )
}

export async function stageToJpg(
  stage: Konva.Stage,
  quality = 0.92,
): Promise<Blob> {
  return jpgWithDensity(
    await dataUrlToBlob(
      stage.toDataURL({ pixelRatio: 1, mimeType: 'image/jpeg', quality }),
    ),
  )
}

/**
 * PDF del tamaño exacto del lienzo exportado.
 *
 * La página se deriva de los PÍXELES reales, no de las pulgadas nominales.
 * Antes se declaraba 4,25×6,25" para un lienzo de 1276×1876 px, que a 300 DPI
 * son 4,2533×6,2533": el PDF escalaba un 0,08 %, distinto en cada eje, y el
 * área de corte acababa en 3,997×5,997" en vez de 4×6 clavados.
 */
export function stageToPdf(stage: Konva.Stage): Blob {
  const wIn = stage.width() / DPI
  const hIn = stage.height() / DPI
  const dataUrl = stage.toDataURL({
    pixelRatio: 1,
    mimeType: 'image/jpeg',
    quality: 0.95,
  })
  const pdf = new jsPDF({
    unit: 'in',
    format: [wIn, hIn],
    orientation: 'portrait',
  })
  pdf.addImage(dataUrl, 'JPEG', 0, 0, wIn, hIn)
  return pdf.output('blob')
}
