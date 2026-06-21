import { Group, Rect, Text } from 'react-konva'
import type { PhotoSlot } from '../../types'
import { SlotFrame } from './frames'

/**
 * Hueco de foto en modo solo lectura (vista previa de galería): placeholder
 * con borde punteado + sugerencia, y el marco según `frameStyle`.
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
      <SlotFrame
        frameStyle={slot.frameStyle}
        width={width}
        height={height}
        cornerRadius={cornerRadius}
      />
    </Group>
  )
}
