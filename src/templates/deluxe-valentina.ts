import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/deluxe-valentina'

// Caballete plegable (dobla en y=900), assets fotorrealistas por mitad:
//  · ARRIBA (rotada 180°): FondoArriba (rosa floral) + 2 fotos + MarcoArriba
//    (marcos de oro + mariposas + "Mis 15", encima).
//  · ABAJO (derecha): TarjetaAbajo (tarjeta blanca con borde dorado y rosas)
//    + foto retrato + textos (parche blanco tapa el texto de relleno del PNG).

const TOP = { x: 0, y: 0, w: 1200, h: 900 } // mitad superior
// Ventana de foto = fracción del panel superior (detectada por canal alfa),
// agrandada para quedar por debajo del borde dorado del marco.
const topWin = (
  fx: number,
  fy: number,
  fw: number,
  fh: number,
  pad: number,
) => ({
  x: Math.round(TOP.x + fx * TOP.w - pad),
  y: Math.round(TOP.y + fy * TOP.h - pad),
  width: Math.round(fw * TOP.w + 2 * pad),
  height: Math.round(fh * TOP.h + 2 * pad),
})
const marco1 = topWin(0.148, 0.2, 0.287, 0.243, 10)
const marco2 = topWin(0.572, 0.58, 0.285, 0.237, 10)

export const deluxeValentina: TemplateDef = {
  id: 'deluxe-valentina',
  name: 'Deluxe Valentina',
  category: 'xv',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 4,
  fold: { atY: 900 },
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/base.svg`,
  underlays: [
    { src: `${BASE}/FondoArriba.png`, x: 0, y: 0, width: 1200, height: 900 },
    { src: `${BASE}/TarjetaAbajo.png`, x: 0, y: 900, width: 1200, height: 900 },
  ],
  overlays: [
    // Marcos + mariposas + "Mis 15" (mitad superior, encima de las fotos).
    { src: `${BASE}/MarcoArriba.png`, x: 0, y: 0, width: 1200, height: 900 },
    // Placa de texto: cubre el texto de relleno horneado en la mitad derecha
    // de la tarjeta (texto medido hasta x~1002; marco dorado en x~1105) y da
    // fondo legible a los textos, centrada en x~742.
    { src: `${BASE}/parche.svg`, x: 455, y: 1007, width: 575, height: 680 },
  ],
  photoSlots: [
    // --- mitad superior (rotada 180°) ---
    {
      id: 'foto-1',
      ...marco1,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 6,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    {
      id: 'foto-2',
      ...marco2,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 6,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    // --- mitad inferior: foto retrato en el marco IZQUIERDO de la tarjeta ---
    // (marco medido por píxeles: interior x[118..448] y[305..748] del PNG).
    {
      id: 'foto-retrato',
      x: 117,
      y: 1207,
      width: 325,
      height: 444,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 16,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 507,
      y: 1075,
      width: 470,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 80,
      color: '#b8447a',
      maxLines: 2,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Chelsea Valentina',
    },
    {
      id: 'mensaje',
      x: 517,
      y: 1240,
      width: 450,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 28,
      color: '#5b3a45',
      maxLines: 3,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme',
    },
    {
      id: 'negocio',
      x: 517,
      y: 1420,
      width: 450,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 34,
      fontStyle: 'italic',
      color: '#3b3a7a',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 517,
      y: 1545,
      width: 450,
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
