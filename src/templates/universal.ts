import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/universal'

// Caballete plegable (dobla en y=900), estilo editorial marfil & oro:
//  · ARRIBA (rotada 180° solo al exportar): FondoArriba (papel marfil) + 2 fotos
//    + MarcoArriba (2 marcos de línea fina de oro + laurel central, encima).
//  · ABAJO (al derecho): TarjetaAbajo (papel con marco retrato fino + helecho)
//    + foto retrato en el marco izquierdo + textos a la derecha (la tarjeta NO
//    trae texto horneado, así que no hace falta placa).

const TOP = { x: 0, y: 0, w: 1200, h: 900 } // mitad superior
// Ventana de foto = fracción del panel superior (detectada por canal alfa en
// MarcoArriba.png), agrandada con `pad` para quedar por debajo del filo dorado.
const topWin = (fx: number, fy: number, fw: number, fh: number, pad: number) => ({
  x: Math.round(TOP.x + fx * TOP.w - pad),
  y: Math.round(TOP.y + fy * TOP.h - pad),
  width: Math.round(fw * TOP.w + 2 * pad),
  height: Math.round(fh * TOP.h + 2 * pad),
})
const marcoIzq = topWin(0.188, 0.292, 0.223, 0.419, 10)
const marcoDer = topWin(0.59, 0.291, 0.222, 0.42, 10)

export const universal: TemplateDef = {
  id: 'universal',
  name: 'Universal — Marfil & Oro',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  fold: { atY: 900 },
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/base.svg`,
  underlays: [
    { src: `${BASE}/FondoArriba.png`, x: 0, y: 0, width: 1200, height: 900 },
    { src: `${BASE}/TarjetaAbajo.png`, x: 0, y: 900, width: 1200, height: 900 },
  ],
  overlays: [
    // 2 marcos finos de oro + laurel (mitad superior, encima de las fotos).
    { src: `${BASE}/MarcoArriba.png`, x: 0, y: 0, width: 1200, height: 900 },
  ],
  photoSlots: [
    // --- mitad superior (rotada 180° al exportar) ---
    {
      id: 'foto-1',
      ...marcoIzq,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 3,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    {
      id: 'foto-2',
      ...marcoDer,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 3,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    // --- mitad inferior: foto retrato en el marco IZQUIERDO de la tarjeta ---
    // El marco dorado va DEBAJO de la foto (es underlay), así que la foto se
    // ajusta al interior del marco (px x[121..516] y[123..777] del PNG 1216x896,
    // +2 px para tucar bajo el filo interior sin tapar el oro).
    {
      id: 'foto-retrato',
      x: 119,
      y: 1021,
      width: 399,
      height: 658,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 3,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombres',
      x: 575,
      y: 1090,
      width: 550,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 80,
      color: '#433d31',
      maxLines: 2,
      role: 'custom',
      placeholder: 'Nombres de los novios',
      sample: 'Ana & Luis',
    },
    {
      id: 'fecha',
      x: 575,
      y: 1235,
      width: 550,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 30,
      color: '#6e6656',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Fecha de la boda',
      sample: '12 · 09 · 2026',
    },
    {
      id: 'mensaje',
      x: 585,
      y: 1305,
      width: 530,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 28,
      fontStyle: 'italic',
      color: '#5b5348',
      maxLines: 3,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarnos en este día',
    },
    {
      id: 'negocio',
      x: 585,
      y: 1490,
      width: 530,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 34,
      fontStyle: 'italic bold',
      color: '#8a6d3b',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 585,
      y: 1585,
      width: 530,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 30,
      fontStyle: 'bold',
      color: '#433d31',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
