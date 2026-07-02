import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/deluxe-valentina'

// Caballete plegable (dobla a la mitad en y=900):
//  · MITAD SUPERIOR (rotada 180°): collage — marco de oro con 2 fotos + decoraciones.
//  · MITAD INFERIOR (derecha): tarjeta — placa + 1 foto retrato + nombre e info.

// Región del marco dentro de la mitad superior (retrato 2:3 centrado).
const FR = { x: 320, y: 40, w: 560, h: 820 }
const win = (fx: number, fy: number, fw: number, fh: number, pad: number) => ({
  x: Math.round(FR.x + fx * FR.w - pad),
  y: Math.round(FR.y + fy * FR.h - pad),
  width: Math.round(fw * FR.w + 2 * pad),
  height: Math.round(fh * FR.h + 2 * pad),
})
const big = win(0.282, 0.214, 0.431, 0.385, 10)
const small = win(0.546, 0.711, 0.27, 0.163, 8)

export const deluxeValentina: TemplateDef = {
  id: 'deluxe-valentina',
  name: 'Deluxe Valentina',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 3,
  fold: { atY: 900 },
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/Fondo.png`,
  underlays: [
    {
      src: `${BASE}/Decoraciones.png`,
      x: FR.x,
      y: FR.y,
      width: FR.w,
      height: FR.h,
    },
  ],
  overlays: [
    {
      src: `${BASE}/MarcoOro.png`,
      x: FR.x,
      y: FR.y,
      width: FR.w,
      height: FR.h,
    },
    // Placa de la tarjeta inferior (mitad de abajo, derecha).
    { src: `${BASE}/placa.svg`, x: 70, y: 950, width: 1060, height: 800 },
  ],
  photoSlots: [
    // --- mitad superior (rotada) ---
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
    // --- mitad inferior: foto retrato de la tarjeta ---
    {
      id: 'foto-retrato',
      x: 130,
      y: 1000,
      width: 400,
      height: 610,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 10,
      frameStyle: 'thin',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 555,
      y: 1010,
      width: 570,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 96,
      color: '#b8860b',
      maxLines: 2,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Chelsea Valentina',
    },
    {
      id: 'mensaje',
      x: 560,
      y: 1300,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 32,
      color: '#5b3a45',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme',
    },
    {
      id: 'negocio',
      x: 560,
      y: 1430,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 42,
      fontStyle: 'italic',
      color: '#7a5b2e',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 560,
      y: 1560,
      width: 560,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 36,
      fontStyle: 'bold',
      color: '#4a3a42',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
