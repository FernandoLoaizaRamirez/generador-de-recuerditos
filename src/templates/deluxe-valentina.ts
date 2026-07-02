import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/deluxe-valentina'

/**
 * Plantilla «Deluxe Valentina»: assets PNG fotorrealistas (mármol + seda,
 * marco de oro hiperrealista, mariposas de seda, perlas y divisor floral).
 *
 * Pipeline de capas: Fondo(png) → fotos del usuario → MarcoOro(png, tapa los
 * bordes) → Decoraciones(png) → Divisor(png posicionado) → textos deluxe.
 *
 * Los huecos se alinean con las ventanas transparentes del marco (detectadas
 * por análisis del canal alfa), ligeramente agrandados para quedar por debajo
 * del borde dorado. Sin marco vectorial (frameStyle 'none'): el oro lo aporta
 * el PNG.
 */
export const deluxeValentina: TemplateDef = {
  id: 'deluxe-valentina',
  name: 'Deluxe Valentina',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/Fondo.png`,
  // Decoraciones DEBAJO de las fotos: mariposas/perlas asoman en los márgenes
  // sin tapar las fotos (el generador las colocó sobre el centro).
  underlays: [`${BASE}/Decoraciones.png`],
  overlays: [
    `${BASE}/MarcoOro.png`,
    {
      src: `${BASE}/SeparadorDivisor.png`,
      x: 190,
      y: 1300,
      width: 300,
      height: 150,
    },
  ],
  photoSlots: [
    {
      id: 'foto-1',
      x: 322,
      y: 368,
      width: 548,
      height: 724,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 10,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    {
      id: 'foto-2',
      x: 632,
      y: 1262,
      width: 366,
      height: 326,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 10,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 40,
      y: 1195,
      width: 600,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 84,
      color: '#b8860b',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Chelsea Valentina',
    },
    {
      id: 'mensaje',
      x: 50,
      y: 1455,
      width: 580,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 27,
      color: '#5b3a45',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme',
    },
    {
      id: 'negocio',
      x: 50,
      y: 1555,
      width: 580,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 36,
      fontStyle: 'italic',
      color: '#7a5b2e',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 50,
      y: 1660,
      width: 580,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 30,
      fontStyle: 'bold',
      color: '#4a3a42',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
