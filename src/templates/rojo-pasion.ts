import { caballete } from './_caballete'

/**
 * «Rojo Pasión» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const rojoPasion = caballete({
  id: 'rojo-pasion',
  name: 'Rojo Pasión',
  category: 'xv',
  kind: 'xv',
  nameColor: '#d4af52',
  ink: '#ddd6c8',
  inkSoft: '#a9a294',
  business: '#d4af52',
})
