import { useMemo } from 'react'
import type Konva from 'konva'
import { Layer, Stage } from 'react-konva'
import { useEditorStore } from '../store/editorStore'
import { useContainerSize } from '../hooks/useContainerSize'
import { useFontsReady } from '../hooks/useFontsReady'
import { useSlotImages } from '../hooks/useSlotImages'
import { resolveOverlay } from '../lib/overlay'
import { CanvasImage } from './canvas/CanvasImage'
import { EditablePhotoSlot } from './canvas/EditablePhotoSlot'
import { EditorText } from './canvas/EditorText'

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>
  onRequestUpload: (slotId: string) => void
}

/**
 * Lienzo del editor (Fase 2): igual que la vista previa pero interactivo —
 * huecos con recorte/zoom/paneo y textos editables, conectado al store.
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

  return (
    <div ref={ref} className="w-full">
      {scale > 0 && (
        <Stage
          ref={stageRef}
          width={cw * scale}
          height={ch * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              selectSlot(null)
              selectText(null)
            }
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) {
              selectSlot(null)
              selectText(null)
            }
          }}
        >
          <Layer>
            <CanvasImage
              src={template.background}
              x={0}
              y={0}
              width={cw}
              height={ch}
            />
            {(template.underlays ?? []).map((layer, i) => {
              const o = resolveOverlay(layer, template.canvas)
              return (
                <CanvasImage
                  key={`u${i}`}
                  src={o.src}
                  x={o.x}
                  y={o.y}
                  width={o.width}
                  height={o.height}
                />
              )
            })}
            {template.photoSlots.map((slot) => (
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
            ))}
            {template.overlays.map((layer, i) => {
              const o = resolveOverlay(layer, template.canvas)
              return (
                <CanvasImage
                  key={i}
                  src={o.src}
                  x={o.x}
                  y={o.y}
                  width={o.width}
                  height={o.height}
                />
              )
            })}
            {fontsReady &&
              template.textFields.map((field) => (
                <EditorText
                  key={field.id}
                  field={field}
                  value={project.texts[field.id]?.value ?? ''}
                  selected={selectedTextId === field.id}
                  onSelect={() => selectText(field.id)}
                />
              ))}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
