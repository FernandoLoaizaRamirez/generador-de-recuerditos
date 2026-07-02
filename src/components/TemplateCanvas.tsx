import { useMemo } from 'react'
import { Layer, Stage } from 'react-konva'
import type { OverlayLayer, TemplateDef } from '../types'
import { useContainerSize } from '../hooks/useContainerSize'
import { useFontsReady } from '../hooks/useFontsReady'
import { resolveOverlay } from '../lib/overlay'
import { CanvasImage } from './canvas/CanvasImage'
import { PhotoSlotView } from './canvas/PhotoSlotView'
import { TextFieldView } from './canvas/TextFieldView'

/**
 * Lienzo WYSIWYG de solo lectura (vista previa / galería). Renderiza la
 * plantilla a medidas reales (4×6") escalada al contenedor. Soporta caballete
 * plegable: la mitad superior se dibuja rotada 180° (ver FoldGroup).
 */
export function TemplateCanvas({ template }: { template: TemplateDef }) {
  const { ref, width: containerWidth } = useContainerSize<HTMLDivElement>()

  const fontFamilies = useMemo(
    () => Array.from(new Set(template.textFields.map((t) => t.fontFamily))),
    [template],
  )
  const fontsReady = useFontsReady(fontFamilies)

  const cw = template.canvas.width
  const ch = template.canvas.height
  const scale = containerWidth > 0 ? containerWidth / cw : 0

  // El doblez (rotación 180° de la mitad superior) se aplica SOLO al exportar
  // (ver ExportStage): en la galería mostramos la plantilla al derecho, tal
  // como se ve el caballete ya doblado.
  const resolve = (l: OverlayLayer) => resolveOverlay(l, template.canvas)
  const underlays = (template.underlays ?? []).map(resolve)
  const overlays = template.overlays.map(resolve)

  const renderSlots = (list: typeof template.photoSlots) =>
    list.map((slot) => <PhotoSlotView key={slot.id} slot={slot} />)
  const renderOverlays = (list: typeof overlays) =>
    list.map((o, i) => (
      <CanvasImage
        key={`${o.src}-${i}`}
        src={o.src}
        x={o.x}
        y={o.y}
        width={o.width}
        height={o.height}
      />
    ))
  const renderTexts = (list: typeof template.textFields) =>
    fontsReady ? list.map((f) => <TextFieldView key={f.id} field={f} />) : null

  return (
    <div ref={ref} className="w-full">
      {scale > 0 && (
        <Stage
          width={cw * scale}
          height={ch * scale}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <CanvasImage
              src={template.background}
              x={0}
              y={0}
              width={cw}
              height={ch}
            />
            {renderOverlays(underlays)}
            {renderSlots(template.photoSlots)}
            {renderOverlays(overlays)}
            {renderTexts(template.textFields)}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
