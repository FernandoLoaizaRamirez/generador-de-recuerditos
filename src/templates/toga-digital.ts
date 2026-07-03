import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/toga-digital'

/**
 * Plantilla «Toga Digital»: graduación con acabado académico + tecnológico.
 * Birrete con borla, trazas de circuito (PCB) en oro y cian, panel de vidrio
 * y marco doble oro+cian alrededor de la foto. A juego con la invitación de
 * graduación de informática. Tipografías Orbitron + Space Grotesk + JetBrains Mono.
 */
export const togaDigital: TemplateDef = {
  id: 'toga-digital',
  name: 'Toga Digital',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/background.svg`,
  overlays: [],
  photoSlots: [
    {
      id: 'foto-principal',
      x: 168,
      y: 344,
      width: 864,
      height: 676,
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
      x: 100,
      y: 1080,
      width: 1000,
      align: 'center',
      fontFamily: 'Orbitron',
      fontSize: 90,
      fontStyle: 'bold',
      color: '#f5c542',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre del graduado(a)',
      sample: 'José Fernando',
      gradient: {
        colorStops: [0, '#fff2c4', 0.5, '#f5c542', 1, '#c79a34'],
      },
      shadow: { color: 'rgba(245,197,66,0.35)', blur: 22, offsetX: 0, offsetY: 0 },
    },
    {
      id: 'mensaje',
      x: 140,
      y: 1276,
      width: 920,
      align: 'center',
      fontFamily: 'Space Grotesk',
      fontSize: 33,
      color: '#b9c4dc',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme en este logro',
    },
    {
      id: 'negocio',
      x: 150,
      y: 1450,
      width: 900,
      align: 'center',
      fontFamily: 'Space Grotesk',
      fontSize: 46,
      fontStyle: 'italic',
      color: '#f5c542',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 150,
      y: 1600,
      width: 900,
      align: 'center',
      fontFamily: 'JetBrains Mono',
      fontSize: 38,
      fontStyle: 'bold',
      color: '#22d3ee',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
