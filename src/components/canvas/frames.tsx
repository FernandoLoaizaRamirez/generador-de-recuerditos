import { Rect } from 'react-konva'
import type { FrameStyle } from '../../types'

// Gradientes con banda de brillo central para un acabado metálico (no plano).
const GOLD_STOPS = [
  0,
  '#f7ecbe',
  0.28,
  '#e3bd5e',
  0.46,
  '#fff6d0',
  0.54,
  '#caa24c',
  0.74,
  '#9c6f1c',
  1,
  '#e6c87a',
]
const SILVER_STOPS = [
  0,
  '#eef2f6',
  0.3,
  '#c2ccd5',
  0.47,
  '#ffffff',
  0.55,
  '#9aa6b2',
  0.75,
  '#76828e',
  1,
  '#dfe6ee',
]

// Sombra proyectada compartida (da sensación de relieve sobre el fondo).
const FRAME_SHADOW = {
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowBlur: 18,
  shadowOffsetX: 0,
  shadowOffsetY: 9,
}

interface FrameProps {
  width: number
  height: number
  cornerRadius: number
}

/** Marco dorado ornamentado: banda metálica + bisel de luz + sombra + remates. */
function GoldFrame({ width, height, cornerRadius }: FrameProps) {
  const corner = (cx: number, cy: number) => (
    <Rect
      x={cx - 9}
      y={cy - 9}
      width={18}
      height={18}
      rotation={45}
      offsetX={9}
      offsetY={9}
      fillLinearGradientStartPoint={{ x: 0, y: -9 }}
      fillLinearGradientEndPoint={{ x: 0, y: 9 }}
      fillLinearGradientColorStops={[0, '#fff2bf', 1, '#b8902f']}
      stroke="#7a5512"
      strokeWidth={1.5}
      listening={false}
    />
  )
  return (
    <>
      {/* Banda dorada principal con sombra proyectada */}
      <Rect
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        strokeWidth={18}
        strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
        strokeLinearGradientEndPoint={{ x: 0, y: height }}
        strokeLinearGradientColorStops={GOLD_STOPS}
        {...FRAME_SHADOW}
        listening={false}
      />
      {/* Bisel: filo de luz interior */}
      <Rect
        x={4}
        y={4}
        width={width - 8}
        height={height - 8}
        cornerRadius={Math.max(0, cornerRadius - 2)}
        stroke="#fff6d0"
        strokeWidth={2}
        opacity={0.55}
        listening={false}
      />
      {/* Línea de sombra interior (profundidad) */}
      <Rect
        x={12}
        y={12}
        width={width - 24}
        height={height - 24}
        cornerRadius={Math.max(0, cornerRadius - 6)}
        stroke="#7a5512"
        strokeWidth={2}
        opacity={0.7}
        listening={false}
      />
      {corner(0, 0)}
      {corner(width, 0)}
      {corner(0, height)}
      {corner(width, height)}
    </>
  )
}

/** Marco delgado con degradado metálico, bisel de luz y sombra suave. */
function ThinFrame({
  width,
  height,
  cornerRadius,
  stops = GOLD_STOPS,
  highlight = '#fff6d0',
}: FrameProps & { stops?: (number | string)[]; highlight?: string }) {
  return (
    <>
      <Rect
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        strokeWidth={8}
        strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
        strokeLinearGradientEndPoint={{ x: 0, y: height }}
        strokeLinearGradientColorStops={stops}
        {...FRAME_SHADOW}
        shadowBlur={14}
        shadowOffsetY={7}
        listening={false}
      />
      <Rect
        x={2.5}
        y={2.5}
        width={width - 5}
        height={height - 5}
        cornerRadius={Math.max(0, cornerRadius - 1)}
        stroke={highlight}
        strokeWidth={1.5}
        opacity={0.5}
        listening={false}
      />
    </>
  )
}

/** Dibuja el marco vectorial según `frameStyle`. */
export function SlotFrame({
  frameStyle,
  width,
  height,
  cornerRadius,
}: FrameProps & { frameStyle?: FrameStyle }) {
  if (frameStyle === 'goldOrnate')
    return (
      <GoldFrame width={width} height={height} cornerRadius={cornerRadius} />
    )
  if (frameStyle === 'thin')
    return (
      <ThinFrame width={width} height={height} cornerRadius={cornerRadius} />
    )
  if (frameStyle === 'silver')
    return (
      <ThinFrame
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        stops={SILVER_STOPS}
        highlight="#ffffff"
      />
    )
  return null
}
