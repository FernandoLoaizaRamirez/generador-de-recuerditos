import { caballete } from './_caballete'

/**
 * «Malla Cyber» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const mallaCyber = caballete({
  id: 'malla-cyber',
  name: 'Malla Cyber',
  category: 'graduacion',
  kind: 'graduacion',
  premium: true,
  displayFont: 'Orbitron',
  bodyFont: 'Space Grotesk',
  nameColor: '#f5c542',
  nameGradient: [
    0,
    '#fff0c2',
    0.35,
    '#f5c542',
    0.6,
    '#e451ff',
    0.85,
    '#8b5cf6',
    1,
    '#f0a8ff',
  ],
  ink: '#ddd6c8',
  inkSoft: '#a9a294',
  business: '#f5c542',
})
