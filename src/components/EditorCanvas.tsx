import { useMemo } from 'react'
import type Konva from 'konva'
import { Layer, Stage } from 'react-konva'
import type { OverlayLayer } from '../types'
import { useEditorStore } from '../store/editorStore'
import { useContainerSize } from '../hooks/useContainerSize'
import { useFontsReady } from '../hooks/useFontsReady'
import { useSlotImages } from '../hooks/useSlotImages'
import { resolveOverlay } from '../lib/overlay'
import { partitionByFold } from '../lib/fold'
import { CanvasImage } from './canvas/CanvasImage'
import { EditablePhotoSlot } from './canvas/EditablePhotoSlot'
import { EditorText } from './canvas/EditorText'
import { FoldGroup } from './canvas/FoldGroup'

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>
  onRequestUpload: (slotId: string) => void
}

/**
 * Lienzo del editor (interactivo). Soporta caballete plegable: la mitad
 * superior se dibuja rotada 180°.
 */
export function EditorCanvas({ stageRef, onRequestUpload }: Props) {
  const template = useEditorStore((s) => s.template)
  const project = useEditorStore((s) => s.project)
  const selectedSlotId = useEditorStore((s) => s.selectedSlotId)
  const selectedTextId = useEditorStore((s) => s.selectedTextId)
  const updateSlotTransform = useEditorStore((s) => s.updateSlotTransform)
  const selectSlot = useEditorStore((s) => s.selectSlot)
  const selectText = useEditorStore((s) => s.selectText)

  const images = useSlotImages(project)
  const { ref, width } = useContainerSize<HTMLDivElement>()

  const fontFamilies = useMemo(
    () =>
      template
        ? Array.from(new Set(template.textFields.map((t) => t.fontFamily)))
        : [],
    [template],
  )
  const fontsReady = useFontsReady(fontFamilies)

  if (!template || !project) return null
  const cw = template.canvas.width
  const ch = template.canvas.height
  const scale = width > 0 ? width / cw : 0
  const foldY = template.fold?.atY

  const resolve = (l: OverlayLayer) => resolveOverlay(l, template.canvas)
  const underlays = (template.underlays ?? []).map(resolve)
  const overlays = template.overlays.map(resolve)
  const slots = partitionByFold(template.photoSlots, (s) => s.y, foldY)
  const und = partitionByFold(underlays, (o) => o.y, foldY)
  const ovl = partitionByFold(overlays, (o) => o.y, foldY)
  const texts = partitionByFold(template.textFields, (t) => t.y, foldY)

  const renderSlot = (slot: (typeof template.photoSlots)[number]) => (
    <EditablePhotoSlot
      key={slot.id}
      slot={slot}
      transform={project.slots[slot.id].transform}
      image={images[slot.id]}
      selected={selectedSlotId === slot.id}
      onSelect={() => selectSlot(slot.id)}
      onTransform={(partial) => updateSlotTransform(slot.id, partial)}
      onRequestUpload={() => {
        selectSlot(slot.id)
        onRequestUpload(slot.id)
      }}
    />
  )
  const renderOverlay = (o: (typeof overlays)[number], i: number) => (
    <CanvasImage
      key={`${o.src}-${i}`}
      src={o.src}
      x={o.x}
      y={o.y}
      width={o.width}
      height={o.height}
    />
  )
  const renderText = (field: (typeof template.textFields)[number]) =>
    fontsReady ? (
      <EditorText
        key={field.id}
        field={field}
        value={project.texts[field.id]?.value ?? ''}
        selected={selectedTextId === field.id}
        onSelect={() => selectText(field.id)}
      />
    ) : null

  const deselect = (e: Konva.KonvaEventObject<Event>) => {
    if (e.target === e.target.getStage()) {
      selectSlot(null)
      selectText(null)
    }
  }

  return (
    <div ref={ref} className="w-full">
      {scale > 0 && (
        <Stage
          ref={stageRef}
          width={cw * scale}
          height={ch * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={deselect}
          onTouchStart={deselect}
        >
          <Layer>
            <CanvasImage
              src={template.background}
              x={0}
              y={0}
              width={cw}
              height={ch}
            />
            {und.bottom.map(renderOverlay)}
            {slots.bottom.map(renderSlot)}
            {ovl.bottom.map(renderOverlay)}
            {texts.bottom.map(renderText)}
            {foldY != null && (
              <FoldGroup atY={foldY} width={cw}>
                {und.top.map(renderOverlay)}
                {slots.top.map(renderSlot)}
                {ovl.top.map(renderOverlay)}
                {texts.top.map(renderText)}
              </FoldGroup>
            )}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
