import type Konva from 'konva'
import {
  Group,
  Image as KImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
} from 'react-konva'
import type { PhotoSlot, Project, TemplateDef, TextField } from '../types'
import type { ExportImages, ExportOverlay } from '../lib/export'
import { fitFontSize, slotImageLayout } from '../lib/image'
import { textStyleProps } from '../lib/textStyle'
import { partitionByFold } from '../lib/fold'
import { SlotFrame } from './canvas/frames'
import { roundedRectClip } from './canvas/clip'
import { FoldGroup } from './canvas/FoldGroup'

interface Props {
  project: Project
  template: TemplateDef
  images: ExportImages
  withBleed: boolean
  cropMarks: boolean
  stageRef: React.RefObject<Konva.Stage | null>
}

/** Marcas de corte en las esquinas del área de corte (dentro del sangrado). */
function CropMarks({ W, H, b }: { W: number; H: number; b: number }) {
  const len = b
  const props = { stroke: '#000', strokeWidth: 2, listening: false }
  const marks: number[][] = [
    [0, b, len, b],
    [b, 0, b, len],
    [b + W, b, b + W + len, b],
    [b + W, 0, b + W, len],
    [0, b + H, len, b + H],
    [b, b + H + (b - len), b, H + 2 * b],
    [b + W, b + H, b + W + len, b + H],
    [b + W, b + H + (b - len), b + W, H + 2 * b],
  ]
  return (
    <>
      {marks.map((pts, i) => (
        <Line key={i} points={pts} {...props} />
      ))}
    </>
  )
}

/**
 * Lienzo de exportación a resolución de impresión (1200×1800 px = 4×6" @ 300
 * DPI, más sangrado opcional). Usa las fotos ORIGINALES, replica el layout del
 * editor (RNF-06) y soporta caballete plegable (mitad superior rotada 180°).
 */
export function ExportStage({
  project,
  template,
  images,
  withBleed,
  cropMarks,
  stageRef,
}: Props) {
  const W = template.canvas.width
  const H = template.canvas.height
  const b = withBleed ? template.canvas.bleedPx : 0
  const foldY = template.fold?.atY

  const renderSlot = (slot: PhotoSlot) => {
    const img = images.slotImages[slot.id]
    const t = project.slots[slot.id].transform
    const cr = slot.cornerRadius ?? 0
    return (
      <Group key={slot.id} x={slot.x} y={slot.y} rotation={slot.rotation ?? 0}>
        <Group clipFunc={roundedRectClip(slot.width, slot.height, cr)}>
          {img ? (
            (() => {
              const g = slotImageLayout(
                slot.width,
                slot.height,
                img.width,
                img.height,
                t,
              )
              return (
                <KImage
                  image={img}
                  x={slot.width / 2 + g.offX}
                  y={slot.height / 2 + g.offY}
                  width={g.drawW}
                  height={g.drawH}
                  offsetX={g.drawW / 2}
                  offsetY={g.drawH / 2}
                  rotation={g.rot}
                  listening={false}
                />
              )
            })()
          ) : (
            <Rect
              width={slot.width}
              height={slot.height}
              cornerRadius={cr}
              fill="#f4ece1"
              listening={false}
            />
          )}
        </Group>
        <SlotFrame
          frameStyle={slot.frameStyle}
          width={slot.width}
          height={slot.height}
          cornerRadius={cr}
        />
      </Group>
    )
  }

  const renderOverlay = (ov: ExportOverlay, i: number) => (
    <KImage
      key={i}
      image={ov.img}
      x={ov.x}
      y={ov.y}
      width={ov.width}
      height={ov.height}
      listening={false}
    />
  )

  const renderText = (field: TextField) => {
    const value = project.texts[field.id]?.value ?? ''
    if (!value.trim()) return null
    const fontSize = fitFontSize(value, {
      fontFamily: field.fontFamily,
      maxFontSize: field.fontSize,
      width: field.width,
      maxLines: field.maxLines,
      fontStyle: field.fontStyle,
    })
    return (
      <Text
        key={field.id}
        x={field.x}
        y={field.y}
        width={field.width}
        text={value}
        align={field.align}
        fontFamily={field.fontFamily}
        fontSize={fontSize}
        fontStyle={field.fontStyle ?? 'normal'}
        wrap="word"
        lineHeight={1.1}
        listening={false}
        {...textStyleProps(field, fontSize)}
      />
    )
  }

  const und = partitionByFold(images.underlays, (o) => o.y, foldY)
  const slots = partitionByFold(template.photoSlots, (s) => s.y, foldY)
  const ovl = partitionByFold(images.overlays, (o) => o.y, foldY)
  const texts = partitionByFold(template.textFields, (t) => t.y, foldY)

  return (
    <Stage ref={stageRef} width={W + 2 * b} height={H + 2 * b}>
      <Layer>
        <KImage
          image={images.bg}
          x={0}
          y={0}
          width={W + 2 * b}
          height={H + 2 * b}
          listening={false}
        />
        <Group x={b} y={b}>
          {und.bottom.map(renderOverlay)}
          {slots.bottom.map(renderSlot)}
          {ovl.bottom.map(renderOverlay)}
          {texts.bottom.map(renderText)}
          {foldY != null && (
            <FoldGroup atY={foldY} width={W}>
              {und.top.map(renderOverlay)}
              {slots.top.map(renderSlot)}
              {ovl.top.map(renderOverlay)}
              {texts.top.map(renderText)}
            </FoldGroup>
          )}
        </Group>
        {cropMarks && b > 0 && <CropMarks W={W} H={H} b={b} />}
      </Layer>
    </Stage>
  )
}
