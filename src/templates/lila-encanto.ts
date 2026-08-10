import { caballete } from './_caballete'

/**
 * «Lila Encanto» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const lilaEncanto = caballete({
  id: 'lila-encanto',
  name: 'Lila Encanto',
  category: 'xv',
  kind: 'xv',
  premium: true,
  nameColor: '#c8a04a',
  ink: '#6f6252',
  inkSoft: '#8a7355',
  business: '#9a7434',
})
