import { Group, Image as KonvaImage, Rect, Text } from 'react-konva'
import type { PhotoSlot, SlotTransform } from '../../types'
import { coverScale } from '../../lib/image'
import { SlotFrame } from './frames'

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

/** Geometría de la foto dentro del hueco (tamaño dibujado y límites de paneo). */
function geom(W: number, H: number, image: HTMLImageElement, t: SlotTransform) {
  const iw = image.width
  const ih = image.height
  const rot = ((t.rotation % 360) + 360) % 360
  const swapped = rot === 90 || rot === 270
  const base = coverScale(W, H, swapped ? ih : iw, swapped ? iw : ih)
  const drawScale = base * t.scale
  const imgW = iw * drawScale
  const imgH = ih * drawScale
  const extentW = swapped ? imgH : imgW
  const extentH = swapped ? imgW : imgH
  const maxOffX = Math.max(0, (extentW - W) / 2)
  const maxOffY = Math.max(0, (extentH - H) / 2)
  return { imgW, imgH, maxOffX, maxOffY, rot }
}

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

  const clip = (ctx: {
    beginPath: () => void
    moveTo: (x: number, y: number) => void
    arcTo: (x1: number, y1: number, x2: number, y2: number, r: number) => void
    closePath: () => void
  }) => {
    const r = cornerRadius
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.arcTo(W, 0, W, H, r)
    ctx.arcTo(W, H, 0, H, r)
    ctx.arcTo(0, H, 0, 0, r)
    ctx.arcTo(0, 0, W, 0, r)
    ctx.closePath()
  }

  let content
  if (image) {
    const g = geom(W, H, image, transform)
    const offX = clampTo(transform.offsetX, g.maxOffX)
    const offY = clampTo(transform.offsetY, g.maxOffY)
    content = (
      <KonvaImage
        image={image}
        x={W / 2 + offX}
        y={H / 2 + offY}
        width={g.imgW}
        height={g.imgH}
        offsetX={g.imgW / 2}
        offsetY={g.imgH / 2}
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
        const g = geom(W, H, image, { ...transform, scale: newScale })
        onTransform({
          scale: newScale,
          offsetX: clampTo(transform.offsetX, g.maxOffX),
          offsetY: clampTo(transform.offsetY, g.maxOffY),
        })
      }}
    >
      <Group clipFunc={clip}>{content}</Group>
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
