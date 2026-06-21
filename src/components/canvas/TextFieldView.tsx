import { Text } from 'react-konva'
import type { TextField } from '../../types'
import { fitFontSize } from '../../lib/image'

/**
 * Campo de texto en modo solo lectura (vista previa de galería). Muestra el
 * contenido de ejemplo (`sample`) o el placeholder, con auto-ajuste de
 * tamaño para no desbordarse.
 */
export function TextFieldView({ field }: { field: TextField }) {
  const text = field.sample ?? field.placeholder
  const fontSize = fitFontSize(text, {
    fontFamily: field.fontFamily,
    maxFontSize: field.fontSize,
    width: field.width,
    maxLines: field.maxLines,
    fontStyle: field.fontStyle,
  })
  return (
    <Text
      x={field.x}
      y={field.y}
      width={field.width}
      text={text}
      align={field.align}
      fontFamily={field.fontFamily}
      fontSize={fontSize}
      fontStyle={field.fontStyle ?? 'normal'}
      fill={field.color}
      wrap="word"
      lineHeight={1.1}
      listening={false}
    />
  )
}
