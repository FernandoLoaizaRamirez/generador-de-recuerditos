import { Group, Rect, Text } from 'react-konva'
import type { PhotoSlot } from '../../types'

const GOLD_STOPS = [0, '#f5ebc4', 0.45, '#c8a04a', 0.7, '#b8902f', 1, '#a9791f']

/** Marco dorado de doble línea con remates en las esquinas. */
function GoldFrame({
  width,
  height,
  cornerRadius,
}: {
  width: number
  height: number
  cornerRadius: number
}) {
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
      />
      {corner(0, 0)}
      {corner(width, 0)}
      {corner(0, height)}
      {corner(width, height)}
    </>
  )
}

/** Marco delgado dorado (para el retrato de la tarjeta). */
function ThinFrame({
  width,
  height,
  cornerRadius,
}: {
  width: number
  height: number
  cornerRadius: number
}) {
  return (
    <Rect
      width={width}
      height={height}
      cornerRadius={cornerRadius}
      strokeWidth={7}
      strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
      strokeLinearGradientEndPoint={{ x: 0, y: height }}
      strokeLinearGradientColorStops={GOLD_STOPS}
    />
  )
}

/**
 * Hueco de foto en modo solo lectura (Fase 1): placeholder con borde
 * punteado + sugerencia, y el marco según `frameStyle`. El recorte/zoom/
 * paneo con imágenes reales llega en la Fase 2.
 */
export function PhotoSlotView({ slot }: { slot: PhotoSlot }) {
  const { x, y, width, height, rotation = 0, cornerRadius = 0 } = slot
  return (
    <Group x={x} y={y} rotation={rotation}>
      <Rect
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        fill="#f4ece1"
        stroke="#caa45a"
        strokeWidth={3}
        dash={[14, 10]}
      />
      <Text
        width={width}
        height={height}
        text={'＋  Foto'}
        align="center"
        verticalAlign="middle"
        fontFamily="system-ui, sans-serif"
        fontSize={34}
        fill="#b08a4a"
        listening={false}
      />
      {slot.frameStyle === 'goldOrnate' && (
        <GoldFrame width={width} height={height} cornerRadius={cornerRadius} />
      )}
      {slot.frameStyle === 'thin' && (
        <ThinFrame width={width} height={height} cornerRadius={cornerRadius} />
      )}
    </Group>
  )
}
