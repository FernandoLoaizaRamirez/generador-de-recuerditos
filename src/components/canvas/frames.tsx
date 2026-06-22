import { Rect } from 'react-konva'
import type { FrameStyle } from '../../types'

const GOLD_STOPS = [0, '#f5ebc4', 0.45, '#c8a04a', 0.7, '#b8902f', 1, '#a9791f']
const SILVER_STOPS = [
  0,
  '#fdfefe',
  0.45,
  '#c9d2da',
  0.7,
  '#9aa6b2',
  1,
  '#7d8893',
]

interface FrameProps {
  width: number
  height: number
  cornerRadius: number
}

/** Marco dorado de doble línea con remates en las esquinas. */
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
      fill="#d9b65a"
      stroke="#8a6315"
      strokeWidth={1.5}
      listening={false}
    />
  )
  return (
    <>
      <Rect
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        strokeWidth={16}
        strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
        strokeLinearGradientEndPoint={{ x: 0, y: height }}
        strokeLinearGradientColorStops={GOLD_STOPS}
        listening={false}
      />
      <Rect
        x={11}
        y={11}
        width={width - 22}
        height={height - 22}
        cornerRadius={Math.max(0, cornerRadius - 4)}
        stroke="#8a6315"
        strokeWidth={2}
        opacity={0.8}
        listening={false}
      />
      {corner(0, 0)}
      {corner(width, 0)}
      {corner(0, height)}
      {corner(width, height)}
    </>
  )
}

/** Marco delgado con degradado (dorado por defecto, plateado opcional). */
function ThinFrame({
  width,
  height,
  cornerRadius,
  stops = GOLD_STOPS,
}: FrameProps & { stops?: (number | string)[] }) {
  return (
    <Rect
      width={width}
      height={height}
      cornerRadius={cornerRadius}
      strokeWidth={7}
      strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
      strokeLinearGradientEndPoint={{ x: 0, y: height }}
      strokeLinearGradientColorStops={stops}
      listening={false}
    />
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
      />
    )
  return null
}
