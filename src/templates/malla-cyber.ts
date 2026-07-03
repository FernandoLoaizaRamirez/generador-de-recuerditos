import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/malla-cyber'

/**
 * Plantilla «Malla Cyber»: estética synthwave / retrowave a juego con la
 * invitación de graduación de informática. Sol de rejilla con líneas de
 * escaneo detrás de la foto, malla Tron en perspectiva, estrellas y marco
 * neón magenta→cian. Tipografías Orbitron + Space Grotesk + JetBrains Mono.
 */
export const mallaCyber: TemplateDef = {
  id: 'malla-cyber',
  name: 'Malla Cyber',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/background.svg`,
  overlays: [],
  photoSlots: [
    {
      id: 'foto-principal',
      x: 190,
      y: 175,
      width: 820,
      height: 775,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 12,
      frameStyle: 'none',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 100,
      y: 1050,
      width: 1000,
      align: 'center',
      fontFamily: 'Orbitron',
      fontSize: 92,
      fontStyle: 'bold',
      color: '#f0a8ff',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre del graduado(a)',
      sample: 'José Fernando',
      gradient: {
        colorStops: [0, '#f6b8ff', 0.5, '#e451ff', 1, '#22d3ee'],
        angle: 'horizontal',
      },
      shadow: { color: 'rgba(228,81,255,0.5)', blur: 28, offsetX: 0, offsetY: 0 },
    },
    {
      id: 'mensaje',
      x: 140,
      y: 1232,
      width: 920,
      align: 'center',
      fontFamily: 'Space Grotesk',
      fontSize: 34,
      color: '#d9c9ff',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme en este gran logro',
    },
    {
      id: 'negocio',
      x: 150,
      y: 1400,
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
      y: 1548,
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
