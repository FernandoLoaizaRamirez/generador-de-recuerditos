import { caballete } from './_caballete'

/**
 * «Azul Cristal» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const azulCristal = caballete({
  id: 'azul-cristal',
  name: 'Azul Cristal',
  category: 'xv',
  kind: 'xv',
  premium: true,
  nameColor: '#8b97a3',
  nameGradient: [
    0,
    '#ffffff',
    0.4,
    '#d7dee5',
    0.55,
    '#9aa6b2',
    0.75,
    '#76828e',
    1,
    '#e8eef3',
  ],
  nameStroke: { color: '#5c6773', width: 1.6 },
  ink: '#6f6252',
  inkSoft: '#8a7355',
  business: '#9a7434',
})
