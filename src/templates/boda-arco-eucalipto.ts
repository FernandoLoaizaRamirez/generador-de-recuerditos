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
 * CÓMO SE HACE EL ARCO SIN TOCAR EL MOTOR: el editor solo recorta rectángulos
 * redondeados —`clipShape: 'custom'` está en el tipo pero no implementado—, así
 * que la foto va en su hueco rectangular y `overlays/bottom-arch.svg` tapa las
 * dos esquinas que sobran por encima de la curva, igual que un pase-partout
 * físico. Por eso el retrato lleva `retratoFrame: 'none'`: un marco vectorial
 * dibujaría el rectángulo del hueco asomando por dentro del arco.
 *
 * El resto del layout lo define `caballete()`.
 */
export const bodaArcoEucalipto = caballete({
  id: 'boda-arco-eucalipto',
  name: 'Arco de Eucalipto',
  category: 'boda',
  kind: 'boda',
  premium: true,
  version: 4,
  // El arco lo pone el overlay; aquí sobra el marco vectorial.
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
