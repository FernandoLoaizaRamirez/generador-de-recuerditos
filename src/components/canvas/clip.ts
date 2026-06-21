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
