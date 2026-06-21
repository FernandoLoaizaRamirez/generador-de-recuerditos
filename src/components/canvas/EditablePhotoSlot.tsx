import { Group, Image as KonvaImage, Rect, Text } from 'react-konva'
import type { PhotoSlot, SlotTransform } from '../../types'
import { slotImageLayout } from '../../lib/image'
import { SlotFrame } from './frames'
import { roundedRectClip } from './clip'

interface Props {
  slot: PhotoSlot
  transform: SlotTransform
  image?: HTMLImageElement
  selected: boolean
  onSelect: () => void
  onTransform: (partial: Partial<SlotTransform>) => void
  onRequestUpload: () => void
}

const MAX_ZOOM = 5
const clampTo = (v: number, max: number) => Math.min(max, Math.max(-max, v))

/**
 * Hueco de foto editable: la imagen se recorta a la forma del hueco y se
 * encuadra con zoom (rueda) y paneo (arrastre), manteniéndose siempre
 * cubriendo el marco (RF-11). Si está vacío, invita a subir una foto.
 */
export function EditablePhotoSlot({
  slot,
  transform,
  image,
  selected,
  onSelect,
  onTransform,
  onRequestUpload,
}: Props) {
  const {
    x,
    y,
    width: W,
    height: H,
    rotation: slotRot = 0,
    cornerRadius = 0,
  } = slot

  let content
  if (image) {
    const g = slotImageLayout(W, H, image.width, image.height, transform)
    content = (
      <KonvaImage
        image={image}
        x={W / 2 + g.offX}
        y={H / 2 + g.offY}
        width={g.drawW}
        height={g.drawH}
        offsetX={g.drawW / 2}
        offsetY={g.drawH / 2}
        rotation={g.rot}
        draggable
        onDragEnd={(e) => {
          onTransform({
            offsetX: clampTo(e.target.x() - W / 2, g.maxOffX),
            offsetY: clampTo(e.target.y() - H / 2, g.maxOffY),
          })
        }}
      />
    )
  } else {
    content = (
      <>
        <Rect width={W} height={H} cornerRadius={cornerRadius} fill="#f4ece1" />
        <Rect
          width={W}
          height={H}
          cornerRadius={cornerRadius}
          stroke="#caa45a"
          strokeWidth={3}
          dash={[14, 10]}
          listening={false}
        />
        <Text
          width={W}
          height={H}
          text={'＋\nToca para\nagregar foto'}
          align="center"
          verticalAlign="middle"
          fontFamily="system-ui, sans-serif"
          fontSize={28}
          fill="#b08a4a"
          listening={false}
        />
      </>
    )
  }

  return (
    <Group
      x={x}
      y={y}
      rotation={slotRot}
      onClick={image ? onSelect : onRequestUpload}
      onTap={image ? onSelect : onRequestUpload}
      onWheel={(e) => {
        if (!image) return
        e.evt.preventDefault()
        const factor = e.evt.deltaY < 0 ? 1.1 : 1 / 1.1
        const newScale = Math.min(
          MAX_ZOOM,
          Math.max(1, transform.scale * factor),
        )
        const g = slotImageLayout(W, H, image.width, image.height, {
          ...transform,
          scale: newScale,
        })
        onTransform({
          scale: newScale,
          offsetX: clampTo(transform.offsetX, g.maxOffX),
          offsetY: clampTo(transform.offsetY, g.maxOffY),
        })
      }}
    >
      <Group clipFunc={roundedRectClip(W, H, cornerRadius)}>{content}</Group>
      <SlotFrame
        frameStyle={slot.frameStyle}
        width={W}
        height={H}
        cornerRadius={cornerRadius}
      />
      {selected && (
        <Rect
          width={W}
          height={H}
          cornerRadius={cornerRadius}
          stroke="#2b8aef"
          strokeWidth={5}
          dash={[12, 7]}
          listening={false}
        />
      )}
    </Group>
  )
}
