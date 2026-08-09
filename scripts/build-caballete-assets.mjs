// Genera los assets de CABALLETE (dos mitades) para las plantillas del
// catálogo, respetando la paleta y el motivo original de cada una.
//
//   node scripts/build-caballete-assets.mjs [id ...]
//
// Sin argumentos procesa todas. Por plantilla escribe:
//   background.svg                base a página completa (cubre el SANGRADO)
//   underlays/top-scene.svg       escena de la mitad superior  (1200x900)
//   underlays/bottom-card.svg     tarjeta de la mitad inferior (1200x900)
//   thumbnail.svg                 miniatura de galería
//
// Los SVG de mitad usan coordenadas LOCALES (0..900). En la tarjeta,
// local_y = canvas_y - 900.
//
// La geometría tiene que coincidir con `CAB` en src/templates/_caballete.ts.
// Si mueves un hueco allí, muévelo en GEO.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const ROOT = 'public/templates'

// Debe reflejar CAB de _caballete.ts
const GEO = {
  foto1: { x: 75, y: 95, w: 505, h: 395, r: -4 },
  foto2: { x: 640, y: 420, w: 490, h: 390, r: 5 },
  // mitad inferior, ya en coordenadas LOCALES
  card: { x: 60, y: 50, w: 1080, h: 800 },
  retrato: { x: 112, y: 112, w: 400, h: 655 },
  panel: { x: 528, y: 96, w: 592, h: 708 },
  ruleName: 348, // bajo el nombre  (canvas 1248)
  ruleFoot: 545, // sobre el negocio (canvas 1445)
}

// ---------------------------------------------------------------- motivos
const MOTIF = {
  heart: '<path d="M0,32 C-46,-8 -32,-52 0,-22 C32,-52 46,-8 0,32 Z"/>',
  star: '<path d="M0,-46 L11,-15 L44,-14 L18,6 L27,38 L0,19 L-27,38 L-18,6 L-44,-14 L-11,-15 Z"/>',
  sparkle: '<path d="M0,-46 Q6,-6 46,0 Q6,6 0,46 Q-6,6 -46,0 Q-6,-6 0,-46 Z"/>',
  leaf:
    '<path d="M-42,0 C-26,-26 26,-28 44,-2 C26,26 -26,24 -42,0 Z"/>' +
    '<path d="M-36,1 C-16,-3 18,-3 38,0" fill="none" stroke="currentColor" stroke-width="2.4" opacity="0.45"/>',
  flower:
    '<g>' +
    [0, 72, 144, 216, 288]
      .map((a) => `<ellipse cx="0" cy="-24" rx="13" ry="22" transform="rotate(${a})"/>`)
      .join('') +
    '</g><circle r="10" opacity="0.75"/>',
  palm:
    '<path d="M0,44 C2,10 6,-16 12,-44" fill="none" stroke="currentColor" stroke-width="3"/>' +
    [-34, -14, 6, 26]
      .map(
        (dy) =>
          `<path d="M2,${dy} C-18,${dy - 14} -34,${dy - 6} -44,${dy + 8} C-28,${dy + 6} -12,${dy + 6} 2,${dy}Z"/>` +
          `<path d="M4,${dy} C24,${dy - 14} 40,${dy - 6} 48,${dy + 8} C32,${dy + 6} 16,${dy + 6} 4,${dy}Z"/>`,
      )
      .join(''),
  sprig:
    '<path d="M-40,34 C-16,14 10,-6 40,-30" fill="none" stroke="currentColor" stroke-width="3"/>' +
    [
      [-26, 16], [-8, 0], [10, -14], [26, -26],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y - 12}" rx="12" ry="9" transform="rotate(-30 ${x} ${y - 12})"/>` +
          `<ellipse cx="${x + 6}" cy="${y + 10}" rx="12" ry="9" transform="rotate(-30 ${x + 6} ${y + 10})"/>`,
      )
      .join(''),
  dot: '<circle r="22"/>',
}

// Posiciones libres de la mitad superior (no pisan foto-1 ni foto-2)
const TOP_SPOTS = [
  [700, 78, 1.0], [880, 168, 0.7], [1064, 74, 0.86], [1140, 246, 0.6],
  [782, 268, 0.52], [960, 318, 0.44], [1160, 402, 0.5],
  [96, 604, 0.92], [246, 718, 0.66], [64, 806, 0.56], [366, 828, 0.74],
  [180, 546, 0.42], [456, 706, 0.4], [26, 350, 0.38],
]
const BOK = [
  [1046, 96, 128], [872, 200, 84], [1156, 300, 96], [742, 60, 56],
  [40, 132, 92], [30, 566, 108], [186, 730, 126], [430, 838, 90], [1150, 828, 78],
]

// -------------------------------------------------------------- utilidades
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
}
const mix = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16)
  const ch = (s) => {
    const x = Math.round((((pa >> s) & 255) * (1 - t)) + (((pb >> s) & 255) * t))
    return x.toString(16).padStart(2, '0')
  }
  return '#' + ch(16) + ch(8) + ch(0)
}

// ------------------------------------------------------------- generadores
function topScene(t) {
  const [b1, b2, b3] = t.bg
  const [a1, a2] = t.acc
  const motif = MOTIF[t.motif] ?? MOTIF.dot
  const glow = t.dark ? a1 : '#ffffff'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <!-- ${t.id} — CAPA 2 / escena de la MITAD SUPERIOR (0,0,1200,900).
       Coordenadas LOCALES a la mitad. Los adornos evitan los dos huecos de
       foto: foto-1 x 54..628 y 39..510 y foto-2 x 584..1150 y 398..873.
       Generado por scripts/build-caballete-assets.mjs -->
  <defs>
    <radialGradient id="bg" cx="40%" cy="26%" r="94%">
      <stop offset="0%" stop-color="${b1}"/>
      <stop offset="46%" stop-color="${b2}"/>
      <stop offset="100%" stop-color="${b3}"/>
    </radialGradient>
    <radialGradient id="bok" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.16"/>
      <stop offset="82%" stop-color="${a1}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${mix(a1, '#ffffff', 0.45)}"/>
      <stop offset="52%" stop-color="${a1}"/>
      <stop offset="100%" stop-color="${a2}"/>
    </linearGradient>
    <symbol id="mo" viewBox="-50 -50 100 100">${motif}</symbol>
  </defs>

  <rect width="1200" height="900" fill="url(#bg)"/>
${BOK.map(([x, y, r]) => `  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#bok)"/>`).join('\n')}

  <g fill="url(#acc)" color="${a2}">
${TOP_SPOTS.map(
    ([x, y, s], i) =>
      `    <use href="#mo" x="-50" y="-50" width="100" height="100" transform="translate(${x},${y}) rotate(${(i * 37) % 60 - 30}) scale(${s})" opacity="${(0.5 + ((i * 7) % 5) * 0.09).toFixed(2)}"/>`,
  ).join('\n')}
  </g>
</svg>
`
}

function bottomCard(t) {
  const [a1, a2] = t.acc
  const card = t.dark ? mix(t.bg[0], '#ffffff', 0.07) : '#fffdf8'
  const cardEdge = t.dark ? mix(t.bg[2], '#000000', 0.2) : '#f4e9d8'
  const panel = t.dark ? mix(t.bg[0], '#ffffff', 0.13) : '#ffffff'
  const c = GEO.card, p = GEO.panel, m = MOTIF[t.motif] ?? MOTIF.dot
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <!-- ${t.id} — CAPA 3 / tarjeta de la MITAD INFERIOR (0,900,1200,900).
       Coordenadas LOCALES: local_y = canvas_y - 900.
       retrato local ${GEO.retrato.x},${GEO.retrato.y} ${GEO.retrato.w}x${GEO.retrato.h}
       panel   local ${p.x},${p.y} ${p.w}x${p.h}
       Generado por scripts/build-caballete-assets.mjs -->
  <defs>
    <filter id="sh" filterUnits="userSpaceOnUse" x="20" y="20" width="1160" height="880">
      <feDropShadow dx="6" dy="12" stdDeviation="12" flood-color="#000000" flood-opacity="0.26"/>
    </filter>
    <linearGradient id="paper" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="${card}"/>
      <stop offset="100%" stop-color="${cardEdge}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${mix(a1, '#ffffff', 0.5)}"/>
      <stop offset="34%" stop-color="${a1}"/>
      <stop offset="56%" stop-color="${mix(a1, '#ffffff', 0.62)}"/>
      <stop offset="86%" stop-color="${a2}"/>
      <stop offset="100%" stop-color="${mix(a1, '#ffffff', 0.3)}"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${a1}" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="${mix(a1, '#ffffff', 0.55)}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${a1}" stop-opacity="0.1"/>
    </linearGradient>
    <symbol id="mo" viewBox="-50 -50 100 100">${m}</symbol>
  </defs>

  <g filter="url(#sh)">
    <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="18" fill="url(#paper)"/>
  </g>
  <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="18" fill="none"
        stroke="url(#gold)" stroke-width="5"/>
  <rect x="${c.x + 16}" y="${c.y + 16}" width="${c.w - 32}" height="${c.h - 32}" rx="12"
        fill="none" stroke="url(#gold)" stroke-width="1.6" opacity="0.72"/>

  <!-- Panel del bloque de textos -->
  <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="14" fill="${panel}" opacity="0.92"/>
  <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="14" fill="none"
        stroke="url(#gold)" stroke-width="1.4" opacity="0.45"/>

  <!-- Filete bajo el nombre -->
  <path d="M600,${GEO.ruleName} Q690,${GEO.ruleName - 3.4} 776,${GEO.ruleName} Q690,${GEO.ruleName + 3.4} 600,${GEO.ruleName} Z" fill="url(#rule)"/>
  <path d="M1048,${GEO.ruleName} Q958,${GEO.ruleName - 3.4} 872,${GEO.ruleName} Q958,${GEO.ruleName + 3.4} 1048,${GEO.ruleName} Z" fill="url(#rule)"/>
  <use href="#mo" x="-50" y="-50" width="100" height="100"
       transform="translate(824,${GEO.ruleName}) scale(0.2)" fill="url(#gold)" color="${a2}"/>

  <!-- Divisor sobre el pie de negocio -->
  <path d="M576,${GEO.ruleFoot} Q684,${GEO.ruleFoot - 3.6} 780,${GEO.ruleFoot} Q684,${GEO.ruleFoot + 3.6} 576,${GEO.ruleFoot} Z" fill="url(#rule)"/>
  <path d="M1072,${GEO.ruleFoot} Q964,${GEO.ruleFoot - 3.6} 868,${GEO.ruleFoot} Q964,${GEO.ruleFoot + 3.6} 1072,${GEO.ruleFoot} Z" fill="url(#rule)"/>
  <use href="#mo" x="-50" y="-50" width="100" height="100"
       transform="translate(824,${GEO.ruleFoot}) scale(0.26)" fill="url(#gold)" color="${a2}"/>

  <!-- Acentos en las esquinas de la tarjeta -->
  <g fill="url(#gold)" color="${a2}" opacity="0.8">
    <use href="#mo" x="-50" y="-50" width="100" height="100" transform="translate(${c.x + 46},${c.y + 44}) scale(0.5)"/>
    <use href="#mo" x="-50" y="-50" width="100" height="100" transform="translate(${c.x + c.w - 46},${c.y + c.h - 44}) rotate(180) scale(0.5)"/>
  </g>
</svg>
`
}

function background(t) {
  const [b1, , b3] = t.bg
  const card = t.dark ? mix(t.bg[0], '#ffffff', 0.07) : '#fffdf8'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800" width="1200" height="1800">
  <!-- ${t.id} — CAPA 1 / base del caballete. Casi no se ve: la tapan las dos
       mitades. Existe porque al exportar con sangrado el motor ESTIRA este
       archivo a 1276x1876, así que es lo único que cubre el margen.
       Generado por scripts/build-caballete-assets.mjs -->
  <defs>
    <linearGradient id="t" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="${b1}"/><stop offset="100%" stop-color="${b3}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1200" height="900" fill="url(#t)"/>
  <rect x="0" y="900" width="1200" height="900" fill="${card}"/>
</svg>
`
}

function thumbnail(t) {
  const [b1, b2, b3] = t.bg
  const [a1, a2] = t.acc
  const card = t.dark ? mix(t.bg[0], '#ffffff', 0.07) : '#fffdf8'
  const panel = t.dark ? mix(t.bg[0], '#ffffff', 0.13) : '#ffffff'
  const slot = t.dark ? mix(t.bg[0], '#ffffff', 0.22) : '#f0e6da'
  const f1 = GEO.foto1, f2 = GEO.foto2, c = GEO.card, r = GEO.retrato, p = GEO.panel
  const m = MOTIF[t.motif] ?? MOTIF.dot
  const frame = (f) => `  <g transform="translate(${f.x},${f.y}) rotate(${f.r})">
    <rect width="${f.w}" height="${f.h}" rx="8" fill="${slot}"/>
    <rect width="${f.w}" height="${f.h}" rx="8" fill="none" stroke="url(#g)" stroke-width="9"/>
  </g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800" width="400" height="600">
  <!-- ${t.id} — miniatura. Mismo viewBox que la plantilla, así que los huecos
       caen donde dice el .ts. Las dos mitades se muestran AL DERECHO, igual
       que en el editor: el giro de 180° solo ocurre al exportar.
       Generado por scripts/build-caballete-assets.mjs -->
  <defs>
    <radialGradient id="tb" cx="40%" cy="26%" r="94%">
      <stop offset="0%" stop-color="${b1}"/><stop offset="46%" stop-color="${b2}"/>
      <stop offset="100%" stop-color="${b3}"/>
    </radialGradient>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${mix(a1, '#ffffff', 0.5)}"/>
      <stop offset="34%" stop-color="${a1}"/>
      <stop offset="56%" stop-color="${mix(a1, '#ffffff', 0.62)}"/>
      <stop offset="86%" stop-color="${a2}"/>
      <stop offset="100%" stop-color="${mix(a1, '#ffffff', 0.3)}"/>
    </linearGradient>
    <symbol id="mo" viewBox="-50 -50 100 100">${m}</symbol>
  </defs>

  <rect x="0" y="0" width="1200" height="900" fill="url(#tb)"/>
  <g fill="url(#g)" color="${a2}" opacity="0.75">
${TOP_SPOTS.slice(0, 7)
  .map(([x, y, s]) => `    <use href="#mo" x="-50" y="-50" width="100" height="100" transform="translate(${x},${y}) scale(${s})"/>`)
  .join('\n')}
  </g>
${frame(f1)}
${frame(f2)}

  <rect x="0" y="900" width="1200" height="900" fill="${card}"/>
  <g transform="translate(0,900)">
    <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="18" fill="${card}"/>
    <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="18" fill="none" stroke="url(#g)" stroke-width="5"/>
    <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="14" fill="${panel}" opacity="0.92"/>
    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="6" fill="${slot}"/>
    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="6" fill="none" stroke="url(#g)" stroke-width="8"/>
    <rect x="600" y="140" width="448" height="26" rx="13" fill="url(#g)" opacity="0.9"/>
    <rect x="660" y="196" width="328" height="26" rx="13" fill="url(#g)" opacity="0.9"/>
    <path d="M600,348 Q690,344.6 776,348 Q690,351.4 600,348 Z" fill="url(#g)" opacity="0.8"/>
    <path d="M1048,348 Q958,344.6 872,348 Q958,351.4 1048,348 Z" fill="url(#g)" opacity="0.8"/>
    <rect x="742" y="366" width="164" height="12" rx="6" fill="${a2}" opacity="0.45"/>
    <rect x="640" y="428" width="368" height="11" rx="5.5" fill="${a2}" opacity="0.38"/>
    <path d="M576,545 Q684,541.4 780,545 Q684,548.6 576,545 Z" fill="url(#g)" opacity="0.8"/>
    <path d="M1072,545 Q964,541.4 868,545 Q964,548.6 1072,545 Z" fill="url(#g)" opacity="0.8"/>
    <rect x="620" y="572" width="408" height="14" rx="7" fill="url(#g)" opacity="0.85"/>
    <rect x="700" y="654" width="248" height="11" rx="5.5" fill="${a2}" opacity="0.45"/>
  </g>
</svg>
`
}

// --------------------------------------------------------------- catálogo
// Paletas y motivos tomados de los background.svg originales, para que cada
// plantilla conserve su identidad al cambiar de estructura.
const TEMPLATES = [
  { id: 'mariposas-doradas',  bg: ['#fdeef2', '#f7cdd8', '#efb0c2'], acc: ['#dcbb62', '#a9791f'], motif: 'flower' },
  { id: 'elegante-dorado',    bg: ['#fffaf0', '#f6ead2', '#f3e7bd'], acc: ['#c8a04a', '#a9791f'], motif: 'flower' },
  { id: 'corazones-rosados',  bg: ['#fff1f5', '#f8c5d6', '#f09fbb'], acc: ['#c8a04a', '#a9791f'], motif: 'heart' },
  { id: 'azul-cristal',       bg: ['#eef6ff', '#cfe2f6', '#a9caea'], acc: ['#c9d2da', '#8b97a3'], motif: 'sparkle' },
  { id: 'lila-encanto',       bg: ['#f8f1fd', '#ddc6f0', '#c4a4e2'], acc: ['#c8a04a', '#a9791f'], motif: 'sparkle' },
  { id: 'bosque-encantado',   bg: ['#f6f8f1', '#e3ecda', '#cdddbf'], acc: ['#c8a04a', '#a9791f'], motif: 'leaf' },
  { id: 'noche-estelar',      bg: ['#202a47', '#141c33', '#0b1124'], acc: ['#d4af52', '#a9791f'], motif: 'star', dark: true },
  { id: 'durazno-suave',      bg: ['#fff5ef', '#f9d8c6', '#f2bca2'], acc: ['#cfa15c', '#a9791f'], motif: 'flower' },
  { id: 'rojo-pasion',        bg: ['#7a1830', '#4a0f20', '#280812'], acc: ['#d4af52', '#a9791f'], motif: 'heart', dark: true },
  { id: 'tropical-esmeralda', bg: ['#fbfdf8', '#eef4e6', '#cfe3d4'], acc: ['#c8a04a', '#1f5e3c'], motif: 'palm' },
  { id: 'glam-negro-oro',     bg: ['#2a2a2a', '#141414', '#000000'], acc: ['#d4af52', '#a9791f'], motif: 'sparkle', dark: true },
  { id: 'atardecer-coral',    bg: ['#ffe1b0', '#ffb088', '#f77e93'], acc: ['#e0aa5c', '#c07a3a'], motif: 'sparkle' },
  { id: 'aqua-menta',         bg: ['#f1fbf7', '#cdeee2', '#a7ddca'], acc: ['#c8a04a', '#a9791f'], motif: 'sprig' },
  { id: 'consola-neon',       bg: ['#070a16', '#05070f', '#03040a'], acc: ['#22d3ee', '#8b5cf6'], motif: 'sparkle', dark: true },
  { id: 'malla-cyber',        bg: ['#0a0b1e', '#140a26', '#1e0b32'], acc: ['#f5c542', '#e451ff'], motif: 'sparkle', dark: true },
  { id: 'toga-digital',       bg: ['#0c1226', '#080c18', '#050710'], acc: ['#f5c542', '#c79a1e'], motif: 'star', dark: true },
  { id: 'boda-blanco-oro',    bg: ['#fffdf6', '#faf4e6', '#f3ead4'], acc: ['#c19a3f', '#9c7622'], motif: 'leaf' },
  { id: 'boda-arco-eucalipto', bg: ['#fdfbf6', '#f3ece0', '#e1d9c9'], acc: ['#c9ac74', '#8a9d83'], motif: 'sprig' },
]

const only = process.argv.slice(2)
const list = only.length ? TEMPLATES.filter((t) => only.includes(t.id)) : TEMPLATES

const put = (p, s) => {
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, s, 'utf8')
}

for (const t of list) {
  if (t.dark === undefined) t.dark = lum(t.bg[0]) < 0.4
  const d = join(ROOT, t.id)
  put(join(d, 'background.svg'), background(t))
  put(join(d, 'underlays', 'top-scene.svg'), topScene(t))
  put(join(d, 'underlays', 'bottom-card.svg'), bottomCard(t))
  put(join(d, 'thumbnail.svg'), thumbnail(t))
  console.log(`  ${t.id.padEnd(20)} 4 assets`)
}
console.log(`\n${list.length} plantillas procesadas.`)
