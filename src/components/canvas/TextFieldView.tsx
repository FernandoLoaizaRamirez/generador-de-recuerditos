import { Text } from 'react-konva'
import type { TextField } from '../../types'

/**
 * Campo de texto de la plantilla. En la Fase 1 muestra el contenido de
 * ejemplo (`sample`) o el placeholder. La edición y el auto-ajuste llegan
 * en la Fase 2.
 */
export function TextFieldView({ field }: { field: TextField }) {
  const text = field.sample ?? field.placeholder
  return (
    <Text
      x={field.x}
      y={field.y}
      width={field.width}
      text={text}
      align={field.align}
      fontFamily={field.fontFamily}
      fontSize={field.fontSize}
      fontStyle={field.fontStyle ?? 'normal'}
      fill={field.color}
      wrap="word"
      lineHeight={1.1}
      listening={false}
    />
  )
}
