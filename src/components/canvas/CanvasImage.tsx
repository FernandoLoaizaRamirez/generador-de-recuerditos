import { Image as KonvaImage } from 'react-konva'
import { useImage } from '../../hooks/useImage'

interface Props {
  src: string
  x: number
  y: number
  width: number
  height: number
}

/** Imagen (fondo / overlay) dibujada en el lienzo a coordenadas de diseño. */
export function CanvasImage({ src, x, y, width, height }: Props) {
  const [image] = useImage(src)
  if (!image) return null
  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      listening={false}
    />
  )
}
