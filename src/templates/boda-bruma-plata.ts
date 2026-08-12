import { caballete } from './_caballete'

/**
 * «Bruma de Plata» — caballete plegable, boda.
 *
 * La boda fría, para quien pide «algo elegante, nada de dorado». Es la primera
 * plantilla del catálogo cuyo acento no es oro ni verde: plata sobre malva
 * ceniza.
 *
 * La primera versión salía plateada media sobre fondo pálido y tenía dos
 * problemas medidos: se confundía con Azul Cristal (ΔE 7.2) y la plata se
 * lavaba contra el borde (Δlum 0.080, cuando hace falta 0.18 para que la
 * moldura se despegue). Se arreglaron los dos invirtiendo la lógica del
 * acento: en vez de peltre medio sobre fondo claro, PLATA CLARA sobre un borde
 * malva hondo. Ahora está a ΔE 15.1 de lo más parecido y el acento contrasta
 * de sobra.
 *
 * El nombre va en Playfair y no en el script de la casa a propósito: el trazo
 * fino de una caligrafía no sostiene ni el degradado metálico ni el contorno,
 * y en plata —que tiene mucho menos cuerpo que el oro— eso se nota el doble.
 */
export const bodaBrumaPlata = caballete({
  id: 'boda-bruma-plata',
  name: 'Bruma de Plata',
  category: 'boda',
  kind: 'boda',
  premium: true,
  featured: true,
  version: 1,
  displayFont: 'Playfair Display',
  nameColor: '#626b7d',
  nameGradient: [
    0,
    '#dfe4ee',
    0.22,
    '#aeb6c6',
    0.42,
    '#737d92',
    0.5,
    '#fbfcff',
    0.6,
    '#7c8598',
    0.8,
    '#3d4356',
    1,
    '#b6bdcb',
  ],
  nameStroke: { color: '#3b4152', width: 2.2 },
  ink: '#464c5d',
  inkSoft: '#646c7f',
  business: '#575e73',
})
