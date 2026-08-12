import { caballete } from './_caballete'

/**
 * «Laurel y Tinta» — caballete plegable, graduación.
 *
 * El contrapeso claro de «Birrete de Honor». Papel de pizarra frío con el
 * acento en verde petróleo: el catálogo no tenía ni un acento que no fuera
 * oro, plata, verde hoja o neón, y ese hueco es justo el que deja sitio a una
 * graduación luminosa sin parecerse a nada.
 *
 * Buscar esta paleta costó cuatro intentos. Todas las variantes cálidas y
 * claras chocaban (ΔE 6-8) con el racimo de marfiles que ya son Elegante
 * Dorado, Boda Blanco y Oro y Arco de Eucalipto; las verdes chocaban con
 * Bosque Encantado y Tropical Esmeralda. El gris frío estaba vacío.
 *
 * El verde petróleo es oscuro a propósito: es lo que hace que las molduras
 * biseladas tengan cuerpo sobre un fondo pálido (Δlum 0.248 contra el borde;
 * por debajo de 0.18 el marco se funde con el fondo, que es lo que le pasaba a
 * la primera versión de «Otoño Terracota»).
 */
export const laurelTinta = caballete({
  id: 'laurel-tinta',
  name: 'Laurel y Tinta',
  category: 'graduacion',
  kind: 'graduacion',
  premium: true,
  featured: true,
  version: 1,
  displayFont: 'Playfair Display',
  nameColor: '#1f6f6b',
  nameGradient: [
    0,
    '#bfe0dc',
    0.22,
    '#64a8a2',
    0.42,
    '#2b7d78',
    0.52,
    '#eafaf7',
    0.62,
    '#237570',
    0.8,
    '#0e4a48',
    1,
    '#7fbcb6',
  ],
  nameStroke: { color: '#0a3232', width: 2 },
  ink: '#2f3b3a',
  inkSoft: '#586462',
  business: '#1f6f6b',
})
