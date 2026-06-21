import { useMemo } from 'react'
import { Layer, Stage } from 'react-konva'
import type { TemplateDef } from '../types'
import { useContainerSize } from '../hooks/useContainerSize'
import { useFontsReady } from '../hooks/useFontsReady'
import { CanvasImage } from './canvas/CanvasImage'
import { PhotoSlotView } from './canvas/PhotoSlotView'
import { TextFieldView } from './canvas/TextFieldView'

/**
 * Lienzo WYSIWYG que renderiza una plantilla a sus medidas reales
 * (1200×1800 px = 4×6") escalada de forma responsiva al contenedor.
 * Modo solo lectura en la Fase 1.
 *
 * Orden de dibujo (z): fondo → huecos de foto → adornos (mariposas) → textos.
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
            {template.photoSlots.map((slot) => (
              <PhotoSlotView key={slot.id} slot={slot} />
            ))}
            {template.overlays.map((src) => (
              <CanvasImage
                key={src}
                src={src}
                x={0}
                y={0}
                width={cw}
                height={ch}
              />
            ))}
            {fontsReady &&
              template.textFields.map((field) => (
                <TextFieldView key={field.id} field={field} />
              ))}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
