import { caballete } from './_caballete'

/**
 * «Toga Digital» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const togaDigital = caballete({
  id: 'toga-digital',
  name: 'Toga Digital',
  category: 'graduacion',
  kind: 'graduacion',
  frameStyle: 'thin',
  displayFont: 'Orbitron',
  bodyFont: 'Space Grotesk',
  nameColor: '#f5c542',
  nameGradient: [
    0,
    '#fff6d0',
    0.35,
    '#f5c542',
    0.6,
    '#c79a1e',
    0.85,
    '#8a6a12',
    1,
    '#ffe9a8',
  ],
  ink: '#ddd6c8',
  inkSoft: '#a9a294',
  business: '#f5c542',
})
