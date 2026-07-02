import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/deluxe-valentina'

// El marco + fotos ocupan una región superior (deja una banda inferior para
// los textos). Las ventanas de foto se derivan de esta región usando las
// fracciones detectadas en el canal alfa del marco.
const FR = { x: 168, y: 10, w: 864, h: 1330 }
const win = (fx: number, fy: number, fw: number, fh: number, pad: number) => ({
  x: Math.round(FR.x + fx * FR.w - pad),
  y: Math.round(FR.y + fy * FR.h - pad),
  width: Math.round(fw * FR.w + 2 * pad),
  height: Math.round(fh * FR.h + 2 * pad),
})
const big = win(0.282, 0.214, 0.431, 0.385, 14)
const small = win(0.546, 0.711, 0.27, 0.163, 12)

/**
 * Plantilla «Deluxe Valentina»: assets PNG fotorrealistas. El marco y las
 * fotos van arriba (region FR), las decoraciones detrás (underlay) y los
 * textos abajo sobre una placa translúcida para que sean legibles.
 */
export const deluxeValentina: TemplateDef = {
  id: 'deluxe-valentina',
  name: 'Deluxe Valentina',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 2,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/Fondo.png`,
  underlays: [
    { src: `${BASE}/Decoraciones.png`, x: FR.x, y: FR.y, width: FR.w, height: FR.h },
  ],
  overlays: [
    { src: `${BASE}/MarcoOro.png`, x: FR.x, y: FR.y, width: FR.w, height: FR.h },
    { src: `${BASE}/placa.svg`, x: 90, y: 1360, width: 1020, height: 410 },
  ],
  photoSlots: [
    {
      id: 'foto-1',
      ...big,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 10,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    {
      id: 'foto-2',
      ...small,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 8,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 110,
      y: 1378,
      width: 980,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 100,
      color: '#b8860b',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Chelsea Valentina',
    },
    {
      id: 'mensaje',
      x: 150,
      y: 1512,
      width: 900,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 34,
      color: '#5b3a45',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme',
    },
    {
      id: 'negocio',
      x: 150,
      y: 1600,
      width: 900,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 46,
      fontStyle: 'italic',
      color: '#7a5b2e',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 150,
      y: 1700,
      width: 900,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 40,
      fontStyle: 'bold',
      color: '#4a3a42',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
