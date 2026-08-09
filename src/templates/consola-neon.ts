import { caballete } from './_caballete'

/**
 * «Consola Neón» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const consolaNeon = caballete({
  id: 'consola-neon',
  name: 'Consola Neón',
  category: 'graduacion',
  kind: 'graduacion',
  frameStyle: 'silver',
  displayFont: 'Orbitron',
  bodyFont: 'Space Grotesk',
  nameColor: '#22d3ee',
  nameGradient: [
    0,
    '#d6feff',
    0.35,
    '#5ee7f7',
    0.55,
    '#22d3ee',
    0.8,
    '#0e7490',
    1,
    '#67e8f9',
  ],
  ink: '#ddd6c8',
  inkSoft: '#a9a294',
  business: '#22d3ee',
})
