import { caballete } from './_caballete'

/**
 * «Corazones Rosados» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const corazonesRosados = caballete({
  id: 'corazones-rosados',
  name: 'Corazones Rosados',
  category: 'xv',
  kind: 'xv',
  premium: true,
  nameColor: '#c8a04a',
  ink: '#6f6252',
  inkSoft: '#8a7355',
  business: '#9a7434',
})
