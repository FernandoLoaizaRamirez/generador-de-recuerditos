import { caballete } from './_caballete'

const BASE = import.meta.env.BASE_URL + 'templates/boda-arco-eucalipto'

/**
 * «Arco de Eucalipto» — caballete plegable, bodas.
 *
 * v4. La ventana en ARCO vuelve, ahora en el RETRATO de la mitad inferior.
 * En v2 era una pieza de cara única con un arco de 620×810 que no cabía en
 * una mitad de 900 px; el hueco del retrato (400×655) sí admite uno de radio
 * 200, y además es donde la foto manda de verdad en un caballete.
 *
 * EL ARCO ES AHORA UN RECORTE DE VERDAD. Antes la foto ocupaba un hueco
 * rectangular y el overlay tapaba a mano las dos esquinas que sobraban por
 * encima de la curva, porque `clipShape: 'custom'` estaba en el tipo pero sin
 * implementar. Ya está implementado, así que basta con declarar el path: el
 * motor recorta la foto en arco y el overlay solo pone el filete de oro y el
 * eucalipto.
 *
 * El retrato lleva `retratoFrame: 'none'` porque un marco vectorial dibujaría
 * el RECTÁNGULO del hueco asomando por dentro del arco.
 *
 * El resto del layout lo define `caballete()`.
 */
export const bodaArcoEucalipto = caballete({
  id: 'boda-arco-eucalipto',
  name: 'Arco de Eucalipto',
  category: 'boda',
  kind: 'boda',
  premium: true,
  featured: true,
  version: 4,
  // Arco de radio 200 (= ancho/2) sobre el hueco de 400×655: arranca en
  // y=200 y el vértice queda en y=0. Coordenadas locales del hueco.
  retratoClipPath: 'M0,655 L0,200 A200,200 0 0 1 400,200 L400,655 Z',
  // El filete lo pone el overlay; un marco vectorial dibujaría el rectángulo.
  retratoFrame: 'none',
  overlays: [
    {
      src: `${BASE}/overlays/bottom-arch.svg`,
      x: 0,
      y: 900,
      width: 1200,
      height: 900,
    },
  ],
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
