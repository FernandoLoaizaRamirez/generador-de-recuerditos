import { caballete } from './_caballete'

/**
 * «Boda Blanco y Oro» — caballete plegable.
 *
 * El layout (dos mitades, 2 fotos arriba, retrato + textos abajo) lo define
 * `caballete()`, que es común a todo el catálogo; aquí solo va la identidad
 * visual. Los assets por mitad los genera
 * `scripts/build-caballete-assets.mjs` a partir de esta misma paleta.
 */
export const bodaBlancoOro = caballete({
  id: 'boda-blanco-oro',
  name: 'Boda Blanco y Oro',
  category: 'boda',
  kind: 'boda',
  frameStyle: 'goldOrnate',
  nameColor: '#c19a3f',
  ink: '#6f6252',
  inkSoft: '#8a7355',
  business: '#9a7434',
})
