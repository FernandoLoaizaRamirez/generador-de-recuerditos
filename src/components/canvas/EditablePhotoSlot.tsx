import { useRef } from 'react'
import type Konva from 'konva'
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
const clampZoom = (v: number) => Math.min(MAX_ZOOM, Math.max(1, v))

/** Separación entre los dos dedos de un pellizco. */
const pinchDistance = (t: TouchList) =>
  Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)

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

  const imgRef = useRef<Konva.Image>(null)
  // Estado del pellizco en curso. Vive en un ref y no en el store porque
  // `touchmove` dispara ~60 veces por segundo: mandarlo al store llenaría el
  // historial de deshacer (tope 50) con un solo gesto.
  const pinch = useRef<{ dist: number; from: number; to: number } | null>(null)

  /** Aplica un zoom nuevo recolocando el paneo para que siga cubriendo el hueco. */
  const applyZoom = (scale: number) => {
    if (!image) return
    const g = slotImageLayout(W, H, image.width, image.height, {
      ...transform,
      scale,
    })
    onTransform({
      scale,
      offsetX: clampTo(transform.offsetX, g.maxOffX),
      offsetY: clampTo(transform.offsetY, g.maxOffY),
    })
  }

  let content
  if (image) {
    const g = slotImageLayout(W, H, image.width, image.height, transform)
    content = (
      <KonvaImage
        ref={imgRef}
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
      onTouchMove={(e) => {
        if (!image) return
        const t = e.evt.touches
        // Un dedo = paneo, que ya lo lleva `draggable`. Solo interceptamos
        // cuando hay dos.
        if (t.length !== 2) return
        e.evt.preventDefault()
        const node = imgRef.current
        // Konva ya había empezado a arrastrar con el primer dedo; si no se
        // corta, el paneo pelea con el pellizco y la foto pega un salto.
        node?.stopDrag()

        const d = pinchDistance(t)
        if (!pinch.current) {
          pinch.current = {
            dist: d,
            from: transform.scale,
            to: transform.scale,
          }
          return
        }
        const to = clampZoom(pinch.current.from * (d / pinch.current.dist))
        pinch.current.to = to
        // Respuesta en vivo escalando el propio nodo: así el gesto se ve
        // fluido sin tocar el store hasta que el dedo se levanta.
        if (node) {
          const k = to / transform.scale
          node.scaleX(k)
          node.scaleY(k)
          node.getLayer()?.batchDraw()
        }
      }}
      onTouchEnd={() => {
        const p = pinch.current
        pinch.current = null
        if (!p || p.to === p.from) return
        // Se deshace el escalado visual y se confirma UNA sola entrada de
        // historial con el valor final del gesto.
        imgRef.current?.scale({ x: 1, y: 1 })
        applyZoom(p.to)
      }}
      onWheel={(e) => {
        if (!image) return
        e.evt.preventDefault()
        const factor = e.evt.deltaY < 0 ? 1.1 : 1 / 1.1
        applyZoom(clampZoom(transform.scale * factor))
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
