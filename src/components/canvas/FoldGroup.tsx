import type { ReactNode } from 'react'
import { Group } from 'react-konva'

/**
 * Envuelve el contenido de la mitad superior de un caballete plegable y lo
 * rota 180° alrededor del centro de esa mitad (W/2, atY/2), para que quede
 * derecho al doblar y parar la tarjeta.
 */
export function FoldGroup({
  atY,
  width,
  children,
}: {
  atY: number
  width: number
  children: ReactNode
}) {
  return (
    <Group
      x={width / 2}
      y={atY / 2}
      offsetX={width / 2}
      offsetY={atY / 2}
      rotation={180}
    >
      {children}
    </Group>
  )
}
