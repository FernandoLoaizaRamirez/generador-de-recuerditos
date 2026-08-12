import { caballete } from './_caballete'

/**
 * «Birrete de Honor» — caballete plegable, graduación.
 *
 * Llena el hueco más obvio del catálogo: había tres plantillas de graduación y
 * las tres eran neón oscuras de videojuego (Consola Neón, Malla Cyber, Toga
 * Digital). Una familia que celebra una licenciatura no quiere píxeles.
 *
 * Verde botella universitario con oro sobrio, no amarillo neón. La paleta se
 * midió en Lab contra todo el catálogo: la más cercana es Glam Negro y Oro a
 * ΔE 13.9, cuando el par más parecido ya publicado está a 4.1.
 *
 * El nombre va en Playfair y no en el script caligráfico de la casa: «Diego
 * Alberto» bajo «Generación 2026» pide letra grabada de diploma, no de
 * invitación de quinceañera.
 */
export const birreteDeHonor = caballete({
  id: 'birrete-de-honor',
  name: 'Birrete de Honor',
  category: 'graduacion',
  kind: 'graduacion',
  premium: true,
  featured: true,
  version: 1,
  displayFont: 'Playfair Display',
  nameColor: '#e0bc7e',
  nameGradient: [
    0,
    '#fbf0d6',
    0.2,
    '#dfb877',
    0.4,
    '#b98c3c',
    0.5,
    '#fff8e4',
    0.6,
    '#c69a49',
    0.82,
    '#7d5518',
    1,
    '#e8c88d',
  ],
  nameStroke: { color: '#4a3210', width: 2 },
  // La tarjeta es oscura: el panel sale de bg[0] aclarado un 13% (#39544a), y
  // las tintas se miden contra ESE color, no contra el blanco.
  ink: '#f2e9d8',
  inkSoft: '#d5cbb2',
  business: '#e8c893',
})
