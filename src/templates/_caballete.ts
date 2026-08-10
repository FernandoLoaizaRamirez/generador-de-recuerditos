import type { TemplateCategory, TemplateDef, TextField } from '../types'

/**
 * Fábrica del layout de CABALLETE PLEGABLE.
 *
 * Todo el catálogo comparte la misma estructura en dos mitades: se imprime, se
 * dobla por y=900 y se para en ⋀. Definirla 21 veces a mano garantizaba que
 * antes o después divergieran, así que vive UNA sola vez aquí y cada plantilla
 * solo declara su identidad (paleta, motivo, tipografía).
 *
 *   MITAD SUPERIOR (0..900)    escena + 2 fotos enmarcadas + lettering
 *   MITAD INFERIOR (900..1800) tarjeta: retrato a la izquierda, textos a la
 *                              derecha sobre un panel claro
 *
 * El giro de 180° de la mitad superior lo aplica el motor al exportar (ver
 * `partitionByFold` / `FoldGroup`); aquí no hay que hacer nada.
 *
 * Devuelve un `TemplateDef` normal y corriente: el editor y el exportador no
 * saben que existe esta fábrica.
 */

/** Geometría compartida. Los assets generados dibujan contra estos números. */
export const CAB = {
  foldY: 900,
  /** Mitad superior */
  foto1: { x: 75, y: 95, width: 505, height: 395, rotation: -4 },
  foto2: { x: 640, y: 420, width: 490, height: 390, rotation: 5 },
  evento: { x: 660, y: 35, width: 500 },
  /** Mitad inferior */
  retrato: { x: 112, y: 1012, width: 400, height: 655 },
  nombre: { x: 534, y: 1040, width: 580 },
  fecha: { x: 544, y: 1272, width: 560 },
  mensaje: { x: 544, y: 1332, width: 560 },
  negocio: { x: 544, y: 1472, width: 560 },
  telefono: { x: 544, y: 1556, width: 560 },
} as const

/** Qué celebra la pieza: cambia los textos guía, no el layout. */
export type CaballeteKind = 'xv' | 'boda' | 'graduacion'

const COPY: Record<
  CaballeteKind,
  {
    evento: string
    eventoSample: string
    nombre: string
    nombreSample: string
    role: TextField['role']
  }
> = {
  xv: {
    evento: 'Mis XV Años',
    eventoSample: 'Mis XV',
    nombre: 'Nombre de la quinceañera',
    nombreSample: 'Kimberly Sinahí',
    role: 'quinceaneraName',
  },
  boda: {
    evento: 'Nuestra Boda',
    eventoSample: 'Nuestra Boda',
    nombre: 'Nombres de los novios',
    nombreSample: 'Ana & Luis',
    role: 'custom',
  },
  graduacion: {
    evento: 'Mi Graduación',
    eventoSample: 'Generación 2026',
    nombre: 'Nombre del graduado(a)',
    nombreSample: 'Diego Alberto',
    role: 'custom',
  },
}

export interface CaballeteSpec {
  id: string
  name: string
  category: TemplateCategory
  kind: CaballeteKind
  version?: number
  /** Marco vectorial de las fotos. 'none' si el adorno lo pone un overlay. */
  frameStyle?: 'goldOrnate' | 'thin' | 'silver' | 'none'
  /** Tipografía del nombre y del lettering del evento. */
  displayFont?: string
  /** Tipografía del resto de la tarjeta. */
  bodyFont?: string
  /** Color base del nombre (y del degradado por defecto si no se pasa uno). */
  nameColor: string
  nameGradient?: (number | string)[]
  /** Borde del nombre. Útil cuando el degradado se lava sobre fondo claro. */
  nameStroke?: { color: string; width: number }
  /** Tinta de los textos secundarios de la tarjeta. */
  ink: string
  /** Tinta atenuada (fecha) y color del pie de negocio. */
  inkSoft: string
  business: string
  /**
   * Nivel PREMIUM: añade las tres capas de adorno que separan una plantilla
   * decente de una de escaparate — molduras biseladas con relieve real,
   * decoración delantera que monta sobre los marcos (el solape es lo que da
   * profundidad) y adornos sobre la tarjeta. Implica `frameStyle: 'none'`,
   * porque el marco pasa a venir del overlay y no del dibujo vectorial.
   * Los assets los emite `scripts/build-caballete-assets.mjs`.
   */
  premium?: boolean
  /** Adornos extra, ya posicionados por mitad. */
  overlays?: TemplateDef['overlays']
}

/** Degradado metálico por defecto, derivado del color del nombre. */
const GOLD: (number | string)[] = [
  0,
  '#fff6d8',
  0.22,
  '#f0d79b',
  0.42,
  '#e2bd70',
  0.52,
  '#fffbe9',
  0.62,
  '#c9a24e',
  0.8,
  '#9c7328',
  1,
  '#e8cd8a',
]

export function caballete(spec: CaballeteSpec): TemplateDef {
  const BASE = import.meta.env.BASE_URL + 'templates/' + spec.id
  const copy = COPY[spec.kind]
  const display = spec.displayFont ?? 'Great Vibes'
  const body = spec.bodyFont ?? 'Playfair Display'
  // En premium el marco lo pone `overlays/top-frames.svg`, que dibuja una
  // moldura de cuatro caras en inglete; el marco vectorial sobraría.
  const frameStyle = spec.premium ? 'none' : (spec.frameStyle ?? 'thin')
  const half = (src: string, y: number) => ({
    src: `${BASE}/${src}`,
    x: 0,
    y,
    width: 1200,
    height: 900,
  })
  const premiumOverlays = spec.premium
    ? [
        half('overlays/top-frames.svg', 0),
        half('overlays/top-decor.svg', 0),
        half('overlays/bottom-decor.svg', 900),
      ]
    : []
  // Contorno por defecto: un script dorado sin borde se lava sobre los fondos
  // claros de la mitad superior. `textStyle` pinta el relleno DESPUÉS del
  // borde, así que actúa de contorno y no ensucia el trazo.
  const stroke = spec.nameStroke ?? { color: '#7a5a24', width: 2 }

  return {
    id: spec.id,
    name: spec.name,
    category: spec.category,
    thumbnail: `${BASE}/thumbnail.svg`,
    version: spec.version ?? 2,
    fold: { atY: CAB.foldY },
    canvas: { width: 1200, height: 1800, bleedPx: 38, safePx: 38 },

    background: `${BASE}/background.svg`,

    underlays: [
      {
        src: `${BASE}/underlays/top-scene.svg`,
        x: 0,
        y: 0,
        width: 1200,
        height: 900,
      },
      {
        src: `${BASE}/underlays/bottom-card.svg`,
        x: 0,
        y: 900,
        width: 1200,
        height: 900,
      },
    ],

    overlays: [...premiumOverlays, ...(spec.overlays ?? [])],

    photoSlots: [
      // ---- mitad superior (se rota 180° al exportar) ----
      {
        id: 'foto-1',
        ...CAB.foto1,
        clipShape: 'rounded',
        cornerRadius: 8,
        frameStyle,
        defaultFit: 'cover',
      },
      {
        id: 'foto-2',
        ...CAB.foto2,
        clipShape: 'rounded',
        cornerRadius: 8,
        frameStyle,
        defaultFit: 'cover',
      },
      // ---- mitad inferior (queda al derecho) ----
      {
        id: 'foto-retrato',
        ...CAB.retrato,
        rotation: 0,
        clipShape: 'rounded',
        cornerRadius: 6,
        frameStyle,
        defaultFit: 'cover',
      },
    ],

    textFields: [
      {
        id: 'evento',
        ...CAB.evento,
        align: 'center',
        fontFamily: display,
        fontSize: 96,
        color: spec.nameColor,
        maxLines: 1,
        role: 'custom',
        placeholder: copy.evento,
        sample: copy.eventoSample,
        gradient: { colorStops: spec.nameGradient ?? GOLD, angle: 'vertical' },
        stroke,
        shadow: { color: 'rgba(0,0,0,0.30)', blur: 14, offsetX: 0, offsetY: 6 },
      },
      {
        id: 'nombre',
        ...CAB.nombre,
        align: 'center',
        fontFamily: display,
        fontSize: 100,
        color: spec.nameColor,
        maxLines: 2,
        role: copy.role,
        placeholder: copy.nombre,
        sample: copy.nombreSample,
        gradient: { colorStops: spec.nameGradient ?? GOLD, angle: 'vertical' },
        stroke,
        shadow: { color: 'rgba(0,0,0,0.26)', blur: 13, offsetX: 0, offsetY: 5 },
      },
      {
        id: 'fecha',
        ...CAB.fecha,
        align: 'center',
        fontFamily: body,
        fontSize: 28,
        color: spec.inkSoft,
        maxLines: 1,
        role: 'custom',
        placeholder: 'Fecha',
        sample: '14 de Junio de 2026',
      },
      {
        id: 'mensaje',
        ...CAB.mensaje,
        align: 'center',
        fontFamily: body,
        fontSize: 29,
        fontStyle: 'italic',
        color: spec.ink,
        maxLines: 2,
        role: 'message',
        placeholder: 'Mensaje de agradecimiento',
        sample: 'Gracias por acompañarme',
      },
      {
        id: 'negocio',
        ...CAB.negocio,
        align: 'center',
        fontFamily: body,
        fontSize: 34,
        fontStyle: 'italic bold',
        color: spec.business,
        maxLines: 2,
        role: 'businessName',
        placeholder: 'Nombre del negocio',
        sample: 'Videofilmaciones "Yesenia"',
      },
      {
        id: 'telefono',
        ...CAB.telefono,
        align: 'center',
        fontFamily: body,
        fontSize: 28,
        color: spec.inkSoft,
        maxLines: 1,
        role: 'phone',
        placeholder: 'Cel. 0000 00 00 00',
        sample: 'Cel. 6672 21 62 83',
      },
    ],
  }
}
