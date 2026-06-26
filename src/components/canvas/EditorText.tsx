import { Group, Rect, Text } from 'react-konva'
import type { TextField } from '../../types'
import { fitFontSize } from '../../lib/image'
import { textStyleProps } from '../../lib/textStyle'

interface Props {
  field: TextField
  value: string
  selected: boolean
  onSelect: () => void
}

/**
 * Campo de texto editable. Muestra el valor del proyecto (o el placeholder
 * atenuado si está vacío) con auto-ajuste de tamaño (RF-21) y acabado deluxe
 * (gradiente metálico + borde + sombra). El texto se edita desde el panel.
 */
export function EditorText({ field, value, selected, onSelect }: Props) {
  const isPlaceholder = !value.trim()
  const text = isPlaceholder ? field.placeholder : value
  const fontSize = fitFontSize(text, {
    fontFamily: field.fontFamily,
    maxFontSize: field.fontSize,
    width: field.width,
    maxLines: field.maxLines,
    fontStyle: field.fontStyle,
  })
  const style = textStyleProps(field, fontSize, { placeholder: isPlaceholder })

  return (
    <Group onClick={onSelect} onTap={onSelect}>
      {selected && (
        <Rect
          x={field.x - 6}
          y={field.y - 6}
          width={field.width + 12}
          height={fontSize * field.maxLines * 1.2 + 12}
          cornerRadius={6}
          fill="#2b8aef"
          opacity={0.1}
          listening={false}
        />
      )}
      <Text
        x={field.x}
        y={field.y}
        width={field.width}
        text={text}
        align={field.align}
        fontFamily={field.fontFamily}
        fontSize={fontSize}
        fontStyle={field.fontStyle ?? 'normal'}
        opacity={isPlaceholder ? 0.7 : 1}
        wrap="word"
        lineHeight={1.1}
        {...style}
      />
    </Group>
  )
}
