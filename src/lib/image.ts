/**
 * Utilidades de imagen y geometría para los huecos de foto.
 *
 * Estrategia de rendimiento (RNF-01): el editor trabaja con una versión
 * reducida ("preview") de la foto, mientras el Blob original se conserva en
 * IndexedDB para la exportación en alta resolución (Fase 3).
 */

/** Genera un HTMLImageElement reducido (máx. `maxDim` px de lado) desde un Blob. */
export async function blobToPreviewImage(
  blob: Blob,
  maxDim = 1600,
): Promise<HTMLImageElement> {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () =>
      reject(new Error('No se pudo cargar la imagen reducida'))
    img.src = dataUrl
  })
  return img
}

/** Escala base "cover": la foto llena el hueco sin dejar huecos. */
export function coverScale(
  slotW: number,
  slotH: number,
  imgW: number,
  imgH: number,
): number {
  if (!imgW || !imgH) return 1
  return Math.max(slotW / imgW, slotH / imgH)
}

/**
 * Limita el paneo para que la foto siga cubriendo el hueco (sin bordes
 * vacíos). Devuelve el offset corregido en px.
 */
export function clampOffset(
  offset: number,
  slotSize: number,
  scaledImgSize: number,
): number {
  const max = Math.max(0, (scaledImgSize - slotSize) / 2)
  return Math.min(max, Math.max(-max, offset))
}

const measureCanvas =
  typeof document !== 'undefined' ? document.createElement('canvas') : null

/**
 * Calcula el tamaño de fuente que hace que `text` quepa en `width` sin pasar
 * de `maxLines` (RF-21). Usa medición con canvas + ajuste de línea por palabra.
 */
export function fitFontSize(
  text: string,
  opts: {
    fontFamily: string
    maxFontSize: number
    minFontSize?: number
    width: number
    maxLines: number
    fontStyle?: string
  },
): number {
  const { fontFamily, maxFontSize, width, maxLines } = opts
  const minFontSize = opts.minFontSize ?? 10
  const ctx = measureCanvas?.getContext('2d')
  if (!ctx || !text.trim()) return maxFontSize

  const weight = opts.fontStyle?.includes('bold') ? 'bold' : 'normal'
  const style = opts.fontStyle?.includes('italic') ? 'italic' : 'normal'
  const words = text.split(/\s+/)

  const linesAt = (size: number): number => {
    ctx.font = `${style} ${weight} ${size}px "${fontFamily}"`
    let lines = 1
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (ctx.measureText(candidate).width > width && current) {
        lines++
        current = word
      } else {
        current = candidate
      }
    }
    return lines
  }

  for (let size = maxFontSize; size > minFontSize; size--) {
    if (linesAt(size) <= maxLines) return size
  }
  return minFontSize
}
