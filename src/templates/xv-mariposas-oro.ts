import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/xv-mariposas-oro'

/**
 * «Mariposas de Oro» — colección PREMIUM, XV años.
 *
 * CABALLETE PLEGABLE (v2). La v1 era de cara única; se rehizo con la
 * estructura en dos mitades del catálogo (la misma de `universal` y
 * `deluxe-valentina`), que es como se produce realmente un recuerdito de mesa:
 * se imprime, se dobla por y=900 y se para en ⋀.
 *
 *   MITAD SUPERIOR (0..900)   escena rosa: 2 fotos enmarcadas + «Mis XV Años»
 *   MITAD INFERIOR (900..1800) tarjeta marfil: retrato a la izquierda y el
 *                              bloque de textos a la derecha
 *
 * EL GIRO DE 180° LO APLICA EL MOTOR, NO ESTA PLANTILLA. Con `fold` presente,
 * `ExportStage` reparte los elementos por `y` y rota la mitad superior solo al
 * EXPORTAR (ver `partitionByFold` y `FoldGroup`). En el editor y en la galería
 * las dos mitades se ven al derecho, que es como el usuario necesita verlas
 * para encuadrar. Aquí no hay que hacer nada especial.
 *
 * ASSETS POR MITAD. Los adornos se colocan con `PositionedOverlay` en la mitad
 * que les toca, y su SVG usa coordenadas LOCALES (0..900), no del lienzo:
 * en los archivos de abajo, local_y = canvas_y - 900.
 *
 * ALINEACIÓN DE MARCOS: `overlays/top-frames.svg` dibuja cada moldura con
 * `translate(x,y) rotate(rotation)` usando EXACTAMENTE los valores de los
 * photoSlots de esta mitad — la misma transformación que Konva aplica al
 * <Group> del hueco. Si mueves un slot aquí, muévelo allí igual.
 */
export const xvMariposasOro: TemplateDef = {
  id: 'xv-mariposas-oro',
  name: 'Mariposas de Oro',
  category: 'xv',
  featured: true,
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 2,
  fold: { atY: 900 },
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },

  background: `${BASE}/background.svg`,

  underlays: [
    {
      src: `${BASE}/underlays/top-scene.svg`,
      x: 0,
      y: 0,
      width: 1200,
      height: 900,
    },
    {
      src: `${BASE}/underlays/bottom-card.svg`,
      x: 0,
      y: 900,
      width: 1200,
      height: 900,
    },
  ],

  overlays: [
    {
      src: `${BASE}/overlays/top-frames.svg`,
      x: 0,
      y: 0,
      width: 1200,
      height: 900,
    },
    {
      src: `${BASE}/overlays/top-decor.svg`,
      x: 0,
      y: 0,
      width: 1200,
      height: 900,
    },
    {
      src: `${BASE}/overlays/bottom-decor.svg`,
      x: 0,
      y: 900,
      width: 1200,
      height: 900,
    },
  ],

  photoSlots: [
    // ---------- MITAD SUPERIOR (se rota 180° al exportar) ----------
    // Esquinas ya rotadas: TL(54,77) TR(597,39) BL(84,510) BR(628,472)
    {
      id: 'foto-1',
      x: 75,
      y: 95,
      width: 505,
      height: 395,
      rotation: -4,
      clipShape: 'rounded',
      cornerRadius: 4,
      // El marco viene del overlay, con relieve real; nada de marco vectorial.
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    // Esquinas ya rotadas: TL(622,398) TR(1150,445) BL(584,827) BR(1112,873)
    {
      id: 'foto-2',
      x: 640,
      y: 420,
      width: 490,
      height: 390,
      rotation: 5,
      clipShape: 'rounded',
      cornerRadius: 4,
      frameStyle: 'none',
      defaultFit: 'cover',
    },

    // ---------- MITAD INFERIOR (queda al derecho) ----------
    // Retrato vertical a la izquierda de la tarjeta, como en el resto del
    // catálogo. El id lleva «retrato» a propósito: SlotPanel lo etiqueta así.
    {
      id: 'foto-retrato',
      x: 112,
      y: 1012,
      width: 400,
      height: 655,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 6,
      frameStyle: 'thin',
      defaultFit: 'cover',
    },
  ],

  textFields: [
    // ---------- MITAD SUPERIOR ----------
    {
      // Va arriba, así que también se rota al exportar. En el editor se lee
      // al derecho.
      id: 'evento',
      x: 660,
      y: 35,
      width: 500,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 96,
      color: '#c8a04a',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Mis XV Años',
      sample: 'Mis XV',
      gradient: {
        colorStops: [
          0,
          '#fff6d8',
          0.22,
          '#f0d79b',
          0.42,
          '#e2bd70',
          0.52,
          '#fffbe9',
          0.62,
          '#c9a24e',
          0.8,
          '#9c7328',
          1,
          '#e8cd8a',
        ],
        angle: 'vertical',
      },
      stroke: { color: '#8a6528', width: 2 },
      shadow: {
        color: 'rgba(88,56,32,0.34)',
        blur: 14,
        offsetX: 0,
        offsetY: 6,
      },
    },

    // ---------- MITAD INFERIOR ----------
    {
      // Elemento tipográfico principal. Dos líneas caben de sobra: los nombres
      // compuestos («Kimberly Sinahí») son la norma, no la excepción.
      id: 'nombre',
      x: 534,
      y: 1040,
      width: 580,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 100,
      color: '#c8a04a',
      maxLines: 2,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Kimberly Sinahí',
      gradient: {
        colorStops: [
          0,
          '#fff6d8',
          0.22,
          '#f0d79b',
          0.42,
          '#e2bd70',
          0.52,
          '#fffbe9',
          0.62,
          '#c9a24e',
          0.8,
          '#9c7328',
          1,
          '#e8cd8a',
        ],
        angle: 'vertical',
      },
      stroke: { color: '#8a6528', width: 1.8 },
      shadow: {
        color: 'rgba(88,56,32,0.30)',
        blur: 13,
        offsetX: 0,
        offsetY: 5,
      },
    },
    {
      id: 'fecha',
      x: 544,
      y: 1272,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 28,
      color: '#8a7355',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Fecha',
      sample: '14 de Junio de 2026',
    },
    {
      id: 'mensaje',
      x: 544,
      y: 1332,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 29,
      fontStyle: 'italic',
      color: '#6f6252',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme',
    },
    {
      id: 'negocio',
      x: 544,
      y: 1472,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 34,
      fontStyle: 'italic bold',
      color: '#9a7434',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 544,
      y: 1556,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 28,
      color: '#6b5b45',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
