import type { PhotoSlot } from '../../types'

interface ClipCtx {
  beginPath: () => void
  moveTo: (x: number, y: number) => void
  arcTo: (x1: number, y1: number, x2: number, y2: number, r: number) => void
  closePath: () => void
}

/** Devuelve una `clipFunc` de Konva para un rectángulo redondeado de W×H. */
export function roundedRectClip(W: number, H: number, r: number) {
  return (ctx: ClipCtx) => {
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.arcTo(W, 0, W, H, r)
    ctx.arcTo(W, H, 0, H, r)
    ctx.arcTo(0, H, 0, 0, r)
    ctx.arcTo(0, 0, W, 0, r)
    ctx.closePath()
  }
}

// Un `Path2D` por cadena, no por render: el hueco se redibuja en cada
// arrastre y recompilar el path cada vez sería tirar trabajo.
const cache = new Map<string, Path2D>()
const path2d = (d: string) => {
  let p = cache.get(d)
  if (!p) {
    p = new Path2D(d)
    cache.set(d, p)
  }
  return p
}

/**
 * `clipFunc` del hueco según su `clipShape`.
 *
 * Con `'custom'` el recorte lo define `clipPath`, un path de SVG en
 * coordenadas LOCALES del hueco (de 0,0 a width,height). Sirve para ventanas
 * en arco, óvalo o corazón sin dibujar una máscara a medida por plantilla.
 *
 * Konva usa el VALOR DE RETORNO del clipFunc como argumentos de `clip()`
 * (ver Container._clip: `context.clip.apply(context, clipArgs)`), así que
 * devolver `[path]` acaba en un `ctx.clip(path2d)` nativo. Por eso no hace
 * falta traducir el path a llamadas de canvas.
 */
export function slotClip(slot: PhotoSlot) {
  if (slot.clipShape === 'custom' && slot.clipPath) {
    const p = path2d(slot.clipPath)
    return () => [p]
  }
  // 'rect' es esquina viva aunque la plantilla traiga `cornerRadius`.
  const r = slot.clipShape === 'rect' ? 0 : (slot.cornerRadius ?? 0)
  return roundedRectClip(slot.width, slot.height, r)
}
