import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/boda-arco-eucalipto'

/**
 * «Arco de Eucalipto» — segunda pieza de la colección PREMIUM, para bodas.
 *
 * Se construyó buscando deliberadamente lo CONTRARIO a «Mariposas de Oro»,
 * para que la colección no se lea como la misma plantilla recoloreada:
 *   Mariposas de Oro          Arco de Eucalipto
 *   asimétrica, fotos giradas simétrica, fotos a plomo
 *   rosa empolvado + oro      mármol marfil + eucalipto
 *   oro especular (fiesta)    oro mate (papelería nupcial)
 *   marcos rectangulares      ventana en ARCO + medallón redondo
 *
 * LA VENTANA EN ARCO SIN TOCAR EL MOTOR
 * El editor solo sabe recortar rectángulos redondeados: `clipShape: 'custom'`
 * existe en el tipo pero no está implementado. Así que la foto va en un hueco
 * RECTANGULAR normal y el arco lo define `overlays/passepartout.svg`, que se
 * dibuja encima con la forma calada. Lo que sobra de la foto queda tapado por
 * el passe-partout, igual que hace un marco físico.
 *
 * EL MEDALLÓN SÍ ES NATIVO: un hueco cuadrado de 290×290 con
 * `cornerRadius: 145` (la mitad del lado) produce un círculo exacto con el
 * recorte que ya trae el motor — no necesita máscara.
 *
 * CAPAS
 *   background              mármol marfil: nubes tonales, veteado y grano
 *   underlays/greenery-back eucalipto DETRÁS del passe-partout
 *   [ photoSlots ]          arco + medallón
 *   overlays/passepartout   la tarjeta calada, los filetes de oro y la clave
 *   overlays/greenery-front eucalipto POR DELANTE (el solape da el tercer plano)
 *   overlays/text-flourish  velo tibio + filetes que sostienen la tipografía
 *
 * Si mueves un hueco aquí, mueve en `passepartout.svg` el arco (o el círculo)
 * exactamente igual: esos huecos son la máscara.
 */
export const bodaArcoEucalipto: TemplateDef = {
  id: 'boda-arco-eucalipto',
  name: 'Arco de Eucalipto',
  category: 'boda',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },

  background: `${BASE}/background.svg`,

  underlays: [`${BASE}/underlays/greenery-back.svg`],

  overlays: [
    `${BASE}/overlays/passepartout.svg`,
    `${BASE}/overlays/greenery-front.svg`,
    `${BASE}/overlays/text-flourish.svg`,
  ],

  photoSlots: [
    // Retrato de los novios. El hueco es el rectángulo completo; el arco lo
    // recorta el passe-partout, cuya caladura es exactamente:
    //   M290,1000 L290,500 A310,310 0 0 1 910,500 L910,1000 Z
    // (arranque del arco en y=500, radio 310 = ancho/2, vértice en y=190).
    {
      id: 'foto-principal',
      x: 290,
      y: 190,
      width: 620,
      height: 810,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 2,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
    // Medallón: cuadrado + cornerRadius = lado/2 -> círculo exacto, recortado
    // por el motor. Pisa la esquina inferior derecha del arco a propósito:
    // ese solape es lo único que rompe la simetría de la composición.
    {
      id: 'foto-medallon',
      x: 760,
      y: 805,
      width: 290,
      height: 290,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 145,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],

  textFields: [
    {
      id: 'evento',
      x: 100,
      y: 1152,
      width: 1000,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 32,
      color: '#7c8a76',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Nuestra Boda',
      sample: 'Nuestra Boda',
    },
    {
      // Los nombres son el elemento principal. Oro mate con un borde apenas
      // más oscuro: sobre marfil claro, un oro sin contorno se lava.
      id: 'nombres',
      x: 90,
      y: 1198,
      width: 1020,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 145,
      color: '#b39257',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Nombres de los novios',
      sample: 'Ana & Luis',
      gradient: {
        colorStops: [
          0, '#f4e8c6',
          0.22, '#dcc08a',
          0.44, '#c2a165',
          0.56, '#f0e3bd',
          0.72, '#a5843f',
          0.88, '#836726',
          1, '#cfb37c',
        ],
        angle: 'vertical',
      },
      stroke: { color: '#6f5628', width: 1.8 },
      shadow: { color: 'rgba(70,64,44,0.28)', blur: 14, offsetX: 0, offsetY: 6 },
    },
    {
      id: 'fecha',
      x: 100,
      y: 1404,
      width: 1000,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 32,
      color: '#6b7364',
      maxLines: 1,
      role: 'custom',
      placeholder: 'Fecha de la boda',
      sample: '12 · 09 · 2026',
    },
    {
      id: 'mensaje',
      x: 210,
      y: 1472,
      width: 780,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 29,
      fontStyle: 'italic',
      color: '#5f6659',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarnos en el día más importante de nuestras vidas',
    },
    {
      id: 'negocio',
      x: 210,
      y: 1596,
      width: 780,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 35,
      fontStyle: 'italic bold',
      color: '#977d4a',
      maxLines: 1,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 210,
      y: 1652,
      width: 780,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 27,
      color: '#5f6659',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 667 221 62 83',
    },
  ],
}
