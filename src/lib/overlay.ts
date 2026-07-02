import type { OverlayLayer } from '../types'

export interface ResolvedOverlay {
  src: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * Normaliza una capa de adorno a coordenadas concretas. Una ruta simple se
 * dibuja a lienzo completo; un objeto posicionado usa sus x/y/width/height
 * (con el lienzo como valores por defecto).
 */
export function resolveOverlay(
  layer: OverlayLayer,
  canvas: { width: number; height: number },
): ResolvedOverlay {
  if (typeof layer === 'string') {
    return {
      src: layer,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    }
  }
  return {
    src: layer.src,
    x: layer.x ?? 0,
    y: layer.y ?? 0,
    width: layer.width ?? canvas.width,
    height: layer.height ?? canvas.height,
  }
}
