// Detecta las "ventanas" (aberturas transparentes interiores) de un PNG de
// marco, p. ej. MarcoArriba.png, para alinear los huecos de foto de una
// plantilla sin adivinar coordenadas.
//
// Uso:
//   node scripts/analyze-alpha-windows.mjs <ruta.png> [alphaMax] [minAreaFrac]
//     alphaMax     = alfa <= este valor cuenta como transparente (def. 40)
//     minAreaFrac  = área mínima de una ventana / área imagen (def. 0.01)
//
// Imprime, por cada ventana interior encontrada, su caja en fracciones del
// tamaño de la imagen (fx, fy, fw, fh), que es lo que usa la plantilla:
//   x = fx * anchoMitad,  y = fy * altoMitad,  etc.
//
// Sin dependencias: decodifica el PNG con `zlib` (inflate + des-filtrado).

import { readFileSync } from 'node:fs'
import zlib from 'node:zlib'

const path = process.argv[2]
const alphaMax = Number(process.argv[3] ?? 40)
const minAreaFrac = Number(process.argv[4] ?? 0.01)
if (!path) {
  console.error('Falta la ruta del PNG.')
  process.exit(1)
}

function decodePNG(file) {
  const buf = readFileSync(file)
  let pos = 8
  let width = 0
  let height = 0
  let colorType = 0
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    pos += 4
    const type = buf.toString('ascii', pos, pos + 4)
    pos += 4
    const data = buf.subarray(pos, pos + len)
    pos += len + 4
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      colorType = data[9]
    } else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
  }
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : 1
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = width * ch
  const px = Buffer.alloc(height * stride)
  const paeth = (a, b, c) => {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  let rp = 0
  for (let y = 0; y < height; y++) {
    const ft = raw[rp++]
    for (let x = 0; x < stride; x++) {
      const v = raw[rp++]
      const a = x >= ch ? px[y * stride + x - ch] : 0
      const b = y > 0 ? px[(y - 1) * stride + x] : 0
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0
      let o
      switch (ft) {
        case 1: o = v + a; break
        case 2: o = v + b; break
        case 3: o = v + ((a + b) >> 1); break
        case 4: o = v + paeth(a, b, c); break
        default: o = v
      }
      px[y * stride + x] = o & 0xff
    }
  }
  return { width, height, ch, px }
}

const { width, height, ch, px } = decodePNG(path)
if (ch !== 4) {
  console.error(`El PNG no tiene canal alfa (colorType con ${ch} canales). Una imagen de marco debe exportarse con transparencia.`)
  process.exit(1)
}

const alphaAt = (x, y) => px[(y * width + x) * 4 + 3]
const transparent = new Uint8Array(width * height)
for (let i = 0; i < width * height; i++) transparent[i] = px[i * 4 + 3] <= alphaMax ? 1 : 0

// Componentes conexas (4-vecinos) de píxeles transparentes. Las ventanas
// interiores son las que NO tocan el borde de la imagen (el gran hueco
// exterior sí lo toca y se descarta).
const seen = new Uint8Array(width * height)
const stack = new Int32Array(width * height)
const comps = []
for (let start = 0; start < width * height; start++) {
  if (!transparent[start] || seen[start]) continue
  let sp = 0
  stack[sp++] = start
  seen[start] = 1
  let minx = width, miny = height, maxx = -1, maxy = -1, area = 0, edge = false
  while (sp > 0) {
    const idx = stack[--sp]
    const x = idx % width
    const y = (idx / width) | 0
    area++
    if (x < minx) minx = x
    if (x > maxx) maxx = x
    if (y < miny) miny = y
    if (y > maxy) maxy = y
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) edge = true
    const nb = [idx - 1, idx + 1, idx - width, idx + width]
    if (x === 0) nb[0] = -1
    if (x === width - 1) nb[1] = -1
    for (const n of nb) {
      if (n < 0 || n >= width * height || seen[n] || !transparent[n]) continue
      seen[n] = 1
      stack[sp++] = n
    }
  }
  comps.push({ minx, miny, maxx, maxy, area, edge })
}

const minArea = minAreaFrac * width * height
const windows = comps
  .filter((c) => !c.edge && c.area >= minArea)
  .sort((a, b) => a.miny - b.miny || a.minx - b.minx)

console.log(`Imagen ${width}x${height}, alfa<=${alphaMax}, minArea=${(minAreaFrac * 100).toFixed(1)}%`)
console.log(`Ventanas interiores encontradas: ${windows.length}\n`)
windows.forEach((c, i) => {
  const w = c.maxx - c.minx + 1
  const h = c.maxy - c.miny + 1
  const fx = (c.minx / width).toFixed(3)
  const fy = (c.miny / height).toFixed(3)
  const fw = (w / width).toFixed(3)
  const fh = (h / height).toFixed(3)
  console.log(`Ventana ${i + 1}: px x[${c.minx}..${c.maxx}] y[${c.miny}..${c.maxy}] (${w}x${h})`)
  console.log(`  fracción -> fx=${fx} fy=${fy} fw=${fw} fh=${fh}`)
})
