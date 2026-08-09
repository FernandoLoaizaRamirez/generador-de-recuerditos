import { caballete } from './_caballete'

/**
 * «Arco de Eucalipto» — caballete plegable, bodas.
 *
 * v3. Las versiones anteriores eran de cara única con una ventana en ARCO
 * calada por máscara. Al pasar todo el catálogo a caballete, el arco no
 * sobrevivió: sus proporciones (620×810) no caben en una mitad de 900 px de
 * alto. La identidad —mármol marfil, eucalipto y oro mate— sí se conserva, y
 * el arco puede recuperarse como ventana del RETRATO de la mitad inferior
 * (400×655 admite un arco de radio 200), que es donde ahora manda la foto.
 *
 * El layout lo define `caballete()`; aquí solo va la identidad visual.
 */
export const bodaArcoEucalipto = caballete({
  id: 'boda-arco-eucalipto',
  name: 'Arco de Eucalipto',
  category: 'boda',
  kind: 'boda',
  frameStyle: 'thin',
  nameColor: '#b39257',
  // Oro MATE: banda de brillo ancha y apagada. El oro especular lee a fiesta,
  // no a boda.
  nameGradient: [
    0,
    '#f4e8c6',
    0.22,
    '#dcc08a',
    0.44,
    '#c2a165',
    0.56,
    '#f0e3bd',
    0.72,
    '#a5843f',
    0.88,
    '#836726',
    1,
    '#cfb37c',
  ],
  nameStroke: { color: '#6f5628', width: 1.8 },
  ink: '#5f6659',
  inkSoft: '#6b7364',
  business: '#977d4a',
})
