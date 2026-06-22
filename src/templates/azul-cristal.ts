import type { TemplateDef } from '../types'

const BASE = import.meta.env.BASE_URL + 'templates/azul-cristal'

/**
 * Plantilla «Azul Cristal»: layout en dos columnas — una foto vertical grande
 * a la izquierda (marco plateado) y los textos a la derecha sobre un panel
 * claro. Tema azul, a juego con vestidos azules.
 */
export const azulCristal: TemplateDef = {
  id: 'azul-cristal',
  name: 'Azul Cristal',
  thumbnail: `${BASE}/thumbnail.svg`,
  version: 1,
  canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },
  background: `${BASE}/background.svg`,
  overlays: [],
  photoSlots: [
    {
      id: 'foto-principal',
      x: 70,
      y: 260,
      width: 540,
      height: 1080,
      rotation: 0,
      clipShape: 'rounded',
      cornerRadius: 24,
      frameStyle: 'silver',
      defaultFit: 'cover',
    },
  ],
  textFields: [
    {
      id: 'nombre',
      x: 650,
      y: 320,
      width: 480,
      align: 'center',
      fontFamily: 'Great Vibes',
      fontSize: 92,
      color: '#2a5d9c',
      maxLines: 2,
      role: 'quinceaneraName',
      placeholder: 'Nombre de la quinceañera',
      sample: 'Chelsea Valentina',
    },
    {
      id: 'mensaje',
      x: 670,
      y: 720,
      width: 450,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 32,
      color: '#2d4a6b',
      maxLines: 3,
      role: 'message',
      placeholder: 'Mensaje de agradecimiento',
      sample: 'Gracias por acompañarme en mis XV años',
    },
    {
      id: 'negocio',
      x: 670,
      y: 1080,
      width: 450,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 40,
      fontStyle: 'italic',
      color: '#1f4e8a',
      maxLines: 2,
      role: 'businessName',
      placeholder: 'Nombre del negocio',
      sample: 'Videofilmaciones "Yesenia"',
    },
    {
      id: 'telefono',
      x: 670,
      y: 1260,
      width: 450,
      align: 'center',
      fontFamily: 'Playfair Display',
      fontSize: 36,
      fontStyle: 'bold',
      color: '#3a3a3a',
      maxLines: 1,
      role: 'phone',
      placeholder: 'Cel. 0000 00 00 00',
      sample: 'Cel. 6672 21 62 83',
    },
  ],
}
