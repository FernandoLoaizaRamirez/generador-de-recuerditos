import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/xv-mariposas-oro'

/**
 * «Mariposas de Oro» — primera pieza de la colección PREMIUM.
 *
 * Cara única de 4×6" (sin `fold`): la composición es un collage editorial
 * continuo — foto principal, foto secundaria montada encima, ramo en diagonal
 * y bloque tipográfico — que necesita el alto completo del lienzo. Si más
 * adelante se quiere la versión caballete, basta con añadir `fold: { atY: 900 }`
 * y reubicar los elementos por mitades; el motor no requiere ningún cambio.
 *
 * PROFUNDIDAD POR CAPAS (el orden importa, es lo que da el volumen):
 *   background            fondo de papel: marfil cálido -> rosa empolvado, satén, viñeta
 *   underlays/bokeh       luces desenfocadas (aire entre planos)
 *   underlays/floral-back flores fuera de foco (plano trasero)
 *   underlays/gold-orn.   halo, arabescos y mariposas DETRÁS de las fotos
 *   [ photoSlots ]        las fotos del usuario
 *   overlays/frames       molduras de oro (4 caras biseladas, ya rotadas)
 *   overlays/flowers      flores nítidas MONTADAS sobre los bordes del marco
 *   overlays/butterflies  mariposas en tres escalas = tres planos
 *   overlays/particles    polvo de oro, destellos y perlas
 *   overlays/text-flour.  velo de luz + filetes que sostienen la tipografía
 *
 * ALINEACIÓN DE MARCOS: `overlays/frames.svg` dibuja cada moldura con
 * `translate(x,y) rotate(rotation)` usando EXACTAMENTE los valores de los
 * photoSlots de abajo, que es la misma transformación que aplica Konva al
 * <Group> del hueco. Si mueves un slot aquí, muévelo también allí.
 */
export const xvMariposasOro: TemplateDef = {
  id: 'xv-mariposas-oro',
  name: 'Mariposas de Oro',
  category: 'xv',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },

  background: `${BASE}/background.svg`,

  underlays: [
    `${BASE}/underlays/bokeh.svg`,
    `${BASE}/underlays/floral-back.svg`,
    `${BASE}/underlays/gold-ornament.svg`,
  ],

  overlays: [
    `${BASE}/overlays/frames.svg`,
    `${BASE}/overlays/flowers-front.svg`,
    `${BASE}/overlays/butterflies-front.svg`,
    `${BASE}/overlays/particles.svg`,
    `${BASE}/overlays/text-flourish.svg`,
  ],

  photoSlots: [
    // Protagonista, ligeramente contra-inclinada. Ocupa el eje izquierdo del
    // tercio superior y medio de la pieza. Esquinas ya rotadas:
    // TL(84,166) TR(763,107) BL(161,1045) BR(840,986)
    {
      id: 'foto-principal',
      x: 112,
      y: 190,
      width: 630,
      height: 830,
      rotation: -5,
      clipShape: 'rounded',
      cornerRadius: 4,
      // El marco es un overlay con relieve real; no se dibuja marco vectorial.
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    // Secundaria: más pequeña, rotada al contrario y SOLAPADA sobre la
    // principal (x 652..812) para romper la cuadrícula. Esquinas ya rotadas:
    // TL(671,484) TR(1130,516) BL(631,1067) BR(1090,1099)
    {
      id: 'foto-secundaria',
      x: 690,
      y: 505,
      width: 420,
      height: 545,
      rotation: 4,
      clipShape: 'rounded',
      cornerRadius: 4,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],

  textFields: [
    {
      id: 'evento',
      x: 100,
      y: 1112,
      width: 1000,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 40,
      color: '#a8834a',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Mis XV Años',
      sample: 'Mis XV Años',
    },
    {
      // Elemento tipográfico principal: script con acabado de oro pulido.
      // El borde fino oscuro lo despega del fondo claro sin ensuciar el trazo
      // (textStyle.ts pinta el relleno DESPUÉS del borde).
      id: 'nombre',
      x: 90,
      y: 1170,
      width: 1020,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 155,
      color: '#c8a04a',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre',
      sample: 'Kimberly Sinahí',
      gradient: {
        colorStops: [
          0, '#fff6d8',
          0.22, '#f0d79b',
          0.42, '#e2bd70',
          0.52, '#fffbe9',
          0.62, '#c9a24e',
          0.8, '#9c7328',
          1, '#e8cd8a',
        ],
        angle: 'vertical',
      },
      stroke: { color: '#8a6528', width: 2.2 },
      shadow: { color: 'rgba(88,56,32,0.34)', blur: 16, offsetX: 0, offsetY: 7 },
    },
    {
      id: 'fecha',
      x: 100,
      y: 1382,
      width: 1000,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 34,
      color: '#8a7355',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Fecha',
      sample: '14 de Junio de 2026',
    },
    {
      id: 'mensaje',
      x: 190,
      y: 1470,
      width: 820,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 32,
      fontStyle: 'italic',
      color: '#6f6252',
      maxLines: 2,
      role: 'message',
      placeholder: 'Gracias por acompañarme',
      sample: 'Gracias por acompañarme en una noche que no voy a olvidar',
    },
    {
      id: 'negocio',
      x: 190,
      y: 1605,
      width: 820,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 38,
      fontStyle: 'italic bold',
      color: '#9a7434',
      maxLines: 1,
      role: 'businessName',
      placeholder: 'Videofilmaciones',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 190,
      y: 1665,
      width: 820,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 30,
      color: '#6b5b45',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 000 000 0000',
      sample: 'Cel. 667 221 62 83',
    },
  ],
}
