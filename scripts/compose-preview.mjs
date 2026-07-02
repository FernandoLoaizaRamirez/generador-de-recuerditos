// Compositor OFFLINE para verificar el layout de una plantilla fotorrealista
// SIN navegador (Konva/Chrome suelen fallar con canvas pesado). Decodifica los
// PNG reales, dibuja el layout, aplica el giro 180° de la mitad superior del
// caballete y escribe un PNG que puedes abrir para VER el resultado.
//
// Uso:
//   node scripts/compose-preview.mjs <salida.png>
//
// EDITA la sección "COMPOSICIÓN" de abajo para tu plantilla (rutas + rects).
// Los rects de foto se dibujan como bloques de color para comprobar que
// caen dentro de las aberturas del marco. Sin dependencias (usa `zlib`).

import { readFileSync, writeFileSync } from 'node:fs'
import zlib from 'node:zlib'

function decodePNG(p) {
  const buf = readFileSync(p)
  let pos = 8, width = 0, height = 0, colorType = 0
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); pos += 4
    const type = buf.toString('ascii', pos, pos + 4); pos += 4
    const data = buf.subarray(pos, pos + len); pos += len + 4
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9] }
    else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
  }
  const ch = colorType === 6 ? 4 : 3
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = width * ch
  const px = Buffer.alloc(height * stride)
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
  let rp = 0
  for (let y = 0; y < height; y++) {
    const ft = raw[rp++]
    for (let x = 0; x < stride; x++) {
      const v = raw[rp++]
      const a = x >= ch ? px[y * stride + x - ch] : 0
      const b = y > 0 ? px[(y - 1) * stride + x] : 0
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0
      let o
      switch (ft) { case 1: o = v + a; break; case 2: o = v + b; break; case 3: o = v + ((a + b) >> 1); break; case 4: o = v + paeth(a, b, c); break; default: o = v }
      px[y * stride + x] = o & 0xff
    }
  }
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0, j = 0; i < width * height; i++, j += 4) {
    rgba[j] = px[i * ch]; rgba[j + 1] = px[i * ch + 1]; rgba[j + 2] = px[i * ch + 2]
    rgba[j + 3] = ch === 4 ? px[i * ch + 3] : 255
  }
  return { width, height, data: rgba }
}

const crcTable = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c } return t })()
const crc32 = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
function encodePNG(width, height, data) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) { raw[y * (stride + 1)] = 0; data.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride) }
  const chunk = (type, d) => { const c = Buffer.alloc(12 + d.length); c.writeUInt32BE(d.length, 0); c.write(type, 4, 'ascii'); d.copy(c, 8); c.writeUInt32BE(crc32(c.subarray(4, 8 + d.length)), 8 + d.length); return c }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))])
}

function makeCanvas(W, H) {
  const canvas = Buffer.alloc(W * H * 4)
  const blend = (x, y, r, g, b, a) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return
    const i = (y * W + x) * 4, ia = a / 255, na = 1 - ia
    canvas[i] = r * ia + canvas[i] * na
    canvas[i + 1] = g * ia + canvas[i + 1] * na
    canvas[i + 2] = b * ia + canvas[i + 2] * na
    canvas[i + 3] = Math.max(canvas[i + 3], a)
  }
  const fillRect = (x, y, w, h, r, g, b, a = 255) => {
    for (let yy = y | 0; yy < (y + h) | 0; yy++) for (let xx = x | 0; xx < (x + w) | 0; xx++) blend(xx, yy, r, g, b, a)
  }
  // Dibuja img escalada al rect destino. rot180=voltea el contenido 180°.
  const drawImage = (img, dx, dy, dw, dh, rot180 = false) => {
    for (let oy = 0; oy < dh; oy++) for (let ox = 0; ox < dw; ox++) {
      const sx = Math.min(img.width - 1, (ox / dw * img.width) | 0)
      const sy = Math.min(img.height - 1, (oy / dh * img.height) | 0)
      const si = (sy * img.width + sx) * 4
      const a = img.data[si + 3]
      if (a === 0) continue
      const px = rot180 ? dx + (dw - 1 - ox) : dx + ox
      const py = rot180 ? dy + (dh - 1 - oy) : dy + oy
      blend(px, py, img.data[si], img.data[si + 1], img.data[si + 2], a)
    }
  }
  return { canvas, fillRect, drawImage }
}

// Coloca un elemento de la MITAD SUPERIOR girado 180° respecto al centro de
// esa mitad (W/2, atY/2): mueve el rect y voltea el contenido. Igual que el
// FoldGroup del export.
const foldTop = (W, atY, x, y, w, h) => ({ x: W - x - w, y: atY - y - h })

// ============================ COMPOSICIÓN ============================
// (EDITA esto para tu plantilla — este es el ejemplo real de Deluxe Valentina)
const W = 1200, H = 1800, atY = 900
const DIR = 'public/templates/deluxe-valentina/'
const { canvas, fillRect, drawImage } = makeCanvas(W, H)

const fondo = decodePNG(DIR + 'FondoArriba.png')
const marco = decodePNG(DIR + 'MarcoArriba.png')
const tarjeta = decodePNG(DIR + 'TarjetaAbajo.png')

fillRect(0, 0, W, H, 0xf6, 0xe9, 0xee) // base marfil

// --- mitad inferior (al derecho) ---
drawImage(tarjeta, 0, atY, 1200, 900)
fillRect(117, 1207, 325, 444, 120, 170, 210) // foto retrato (placeholder)
fillRect(463, 1020, 512, 655, 0xfd, 0xfb, 0xf9) // placa de texto

// --- mitad superior (girada 180°) ---
drawImage(fondo, 0, 0, 1200, 900, true)
const win = (fx, fy, fw, fh, pad) => [Math.round(fx * 1200 - pad), Math.round(fy * 900 - pad), Math.round(fw * 1200 + 2 * pad), Math.round(fh * 900 + 2 * pad)]
for (const [x, y, w, h] of [win(0.148, 0.2, 0.287, 0.243, 10), win(0.572, 0.58, 0.285, 0.237, 10)]) {
  const p = foldTop(W, atY, x, y, w, h)
  fillRect(p.x, p.y, w, h, 90, 200, 150) // foto (placeholder) girada
}
drawImage(marco, 0, 0, 1200, 900, true)
fillRect(0, atY - 1, W, 2, 150, 120, 130, 200) // línea de doblez
// =====================================================================

const out = process.argv[2] || 'preview.png'
writeFileSync(out, encodePNG(W, H, canvas))
console.log('Escrito', out)
