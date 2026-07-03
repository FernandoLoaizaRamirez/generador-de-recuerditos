import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/consola-neon'

/**
 * Plantilla «Consola Neón»: tema informática / graduación. Ventana de terminal
 * con marco neón cian que aloja la foto, esquinas HUD, lluvia de código y
 * tipografías tech (Orbitron + JetBrains Mono). A juego con la invitación
 * «SYSTEM://COMPILE».
 */
export const consolaNeon: TemplateDef = {
  id: 'consola-neon',
  name: 'Consola Neón',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/background.svg`,
  overlays: [],
  photoSlots: [
    {
      id: 'foto-principal',
      x: 138,
      y: 240,
      width: 924,
      height: 842,
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
      y: 1136,
      width: 1000,
      align: 'center',
      fontFamily: 'Orbitron',
      fontSize: 96,
      fontStyle: 'bold',
      color: '#8af1ff',
      maxLines: 1,
      role: 'quinceaneraName',
      placeholder: 'Nombre del graduado(a)',
      sample: 'José Fernando',
      gradient: {
        colorStops: [0, '#8af1ff', 0.5, '#22d3ee', 1, '#8b5cf6'],
        angle: 'horizontal',
      },
      shadow: { color: 'rgba(34,211,238,0.55)', blur: 26, offsetX: 0, offsetY: 0 },
    },
    {
      id: 'mensaje',
      x: 140,
      y: 1332,
      width: 920,
      align: 'center',
      fontFamily: 'JetBrains Mono',
      fontSize: 32,
      color: '#9fb2d4',
      maxLines: 2,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: '// gracias por compilar este sueño conmigo',
    },
    {
      id: 'negocio',
      x: 150,
      y: 1500,
      width: 900,
      align: 'center',
      fontFamily: 'Space Grotesk',
      fontSize: 46,
      fontStyle: 'italic',
      color: '#e8c45a',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 150,
      y: 1648,
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
