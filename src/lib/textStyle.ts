import type { TextField } from '../types'

/**
 * Motor de texto "Deluxe": traduce el estilo de un campo a props de Konva
 * que internamente usan las APIs de Canvas que el usuario espera —
 * `createLinearGradient` (gradiente metálico), `strokeStyle`/`lineWidth`
 * (borde) y `shadow*` (sombra suave).
 *
 * Si un campo no define gradiente y es el NOMBRE de la quinceañera, se le
 * aplica por defecto un acabado metálico derivado de su propio color + una
 * sombra suave, para que destaque sin tener que configurar cada plantilla.
 */

/** Gradiente oro pulido reutilizable. */
export const GOLD_GRADIENT: (number | string)[] = [
  0,
  '#fff6cf',
  0.3,
  '#eaca6a',
  0.5,
  '#c8a04a',
  0.72,
  '#9c6f1c',
  1,
  '#f0d488',
]

/** Gradiente plata pulida reutilizable. */
export const SILVER_GRADIENT: (number | string)[] = [
  0,
  '#ffffff',
  0.4,
  '#d7dee5',
  0.55,
  '#9aa6b2',
  0.75,
  '#76828e',
  1,
  '#e8eef3',
]

// ---------- utilidades de color ----------

function parseHex(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim()
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toHex = (r: number, g: number, b: number) =>
  '#' +
  [r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/** Mezcla un color hacia blanco (amt 0..1). */
function lighten(hex: string, amt: number): string {
  const [r, g, b] = parseHex(hex)
  return toHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt)
}

/** Mezcla un color hacia negro (amt 0..1). */
function darken(hex: string, amt: number): string {
  const [r, g, b] = parseHex(hex)
  return toHex(r * (1 - amt), g * (1 - amt), b * (1 - amt))
}

/** Acabado metálico derivado de un color base (sheen claro → base → sombra). */
export function metallicStops(hex: string): (number | string)[] {
  return [0, lighten(hex, 0.6), 0.45, hex, 0.55, hex, 1, darken(hex, 0.42)]
}

// ---------- props de Konva ----------

export interface KonvaTextStyle {
  fill?: string
  fillLinearGradientStartPoint?: { x: number; y: number }
  fillLinearGradientEndPoint?: { x: number; y: number }
  fillLinearGradientColorStops?: (number | string)[]
  stroke?: string
  strokeWidth?: number
  fillAfterStrokeEnabled?: boolean
  shadowColor?: string
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
}

/**
 * Construye las props de relleno/borde/sombra para un `<Text>` de Konva.
 * `placeholder` → texto guía atenuado (sin efectos).
 */
export function textStyleProps(
  field: TextField,
  fontSize: number,
  opts?: { placeholder?: boolean },
): KonvaTextStyle {
  if (opts?.placeholder) return { fill: '#9aa0a6' }

  const props: KonvaTextStyle = {}

  // Relleno: gradiente explícito, o metálico por defecto para el nombre.
  let stops = field.gradient?.colorStops
  if (!stops && field.role === 'quinceaneraName')
    stops = metallicStops(field.color)

  if (stops) {
    const horizontal = field.gradient?.angle === 'horizontal'
    props.fillLinearGradientStartPoint = { x: 0, y: 0 }
    props.fillLinearGradientEndPoint = horizontal
      ? { x: field.width, y: 0 }
      : { x: 0, y: fontSize }
    props.fillLinearGradientColorStops = stops
  } else {
    props.fill = field.color
  }

  // Borde (el relleno se pinta después para que el borde quede como contorno).
  if (field.stroke) {
    props.stroke = field.stroke.color
    props.strokeWidth = field.stroke.width
    props.fillAfterStrokeEnabled = true
  }

  // Sombra: explícita, o suave por defecto para el nombre.
  const shadow =
    field.shadow ??
    (field.role === 'quinceaneraName'
      ? {
          color: 'rgba(0,0,0,0.33)',
          blur: Math.round(fontSize * 0.09),
          offsetX: 0,
          offsetY: Math.round(fontSize * 0.035),
        }
      : undefined)
  if (shadow) {
    props.shadowColor = shadow.color
    props.shadowBlur = shadow.blur
    props.shadowOffsetX = shadow.offsetX ?? 0
    props.shadowOffsetY = shadow.offsetY ?? 0
  }

  return props
}
