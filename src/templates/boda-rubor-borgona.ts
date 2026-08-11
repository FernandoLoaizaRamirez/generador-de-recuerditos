import { caballete } from './_caballete'

/**
 * «Rubor y Borgoña» — caballete plegable, boda.
 *
 * Las dos bodas que había son las dos marfil y oro, y en Lab están a ΔE 4.1
 * una de otra: el par más parecido de todo el catálogo. En la rejilla de
 * miniaturas se leen como la misma plantilla repetida.
 *
 * Ésta se distingue de un vistazo porque tiene color de verdad: del rubor del
 * centro al borgoña del borde, con el oro rosado del ramo. Es la boda cálida
 * que faltaba.
 *
 * Lleva `decor: 'rose'` en el generador —rosas reales en los racimos, no el
 * motivo repetido—, que es de las pocas veces que ese ajuste encaja sin
 * forzarlo.
 */
export const bodaRuborBorgona = caballete({
  id: 'boda-rubor-borgona',
  name: 'Rubor y Borgoña',
  category: 'boda',
  kind: 'boda',
  premium: true,
  featured: true,
  version: 1,
  retratoFrame: 'none',
  nameColor: '#c9835c',
  nameGradient: [
    0,
    '#fbe3d2',
    0.2,
    '#eec2a2',
    0.4,
    '#d99a74',
    0.5,
    '#fff2e4',
    0.58,
    '#c07a52',
    0.8,
    '#8f4a2e',
    1,
    '#e2a97f',
  ],
  // El relleno del nombre queda a 1.17:1 contra el rosa medio del fondo: sobre
  // esta paleta el degradado no separa la letra, la separa el CONTORNO. Por
  // eso va más grueso y más oscuro que en el resto de la tanda, y por eso el
  // lettering se lee igual en la mitad superior (rosa) que sobre el panel
  // blanco de la tarjeta.
  nameStroke: { color: '#5f2c1e', width: 2.4 },
  ink: '#5c3038',
  inkSoft: '#8a5a56',
  business: '#a4553c',
})
