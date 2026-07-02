import { jsPDF } from 'jspdf'
import type Konva from 'konva'
import type { Project, TemplateDef } from '../types'
import { getImageBlob } from './db'
import { coverScale } from './image'
import { resolveOverlay } from './overlay'
import { DPI, MIN_PHOTO_DPI, PRINT_4X6 } from './print'

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

export async function stageToPng(stage: Konva.Stage): Promise<Blob> {
  return dataUrlToBlob(
    stage.toDataURL({ pixelRatio: 1, mimeType: 'image/png' }),
  )
}

export async function stageToJpg(
  stage: Konva.Stage,
  quality = 0.92,
): Promise<Blob> {
  return dataUrlToBlob(
    stage.toDataURL({ pixelRatio: 1, mimeType: 'image/jpeg', quality }),
  )
}

/** Construye un PDF tamaño 4×6" (más sangrado si aplica) con la imagen embebida. */
export function stageToPdf(stage: Konva.Stage, withBleed: boolean): Blob {
  const extra = withBleed ? 2 * PRINT_4X6.bleedInPerSide : 0
  const wIn = PRINT_4X6.widthIn + extra
  const hIn = PRINT_4X6.heightIn + extra
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
