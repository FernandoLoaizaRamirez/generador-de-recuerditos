/**
 * Reparte elementos entre la mitad superior (y < atY) e inferior de un
 * caballete plegable. Sin `atY`, todo va a la mitad inferior (sin doblez).
 */
export function partitionByFold<T>(
  items: T[],
  getY: (item: T) => number,
  atY?: number,
): { top: T[]; bottom: T[] } {
  if (atY == null) return { top: [], bottom: items }
  const top: T[] = []
  const bottom: T[] = []
  for (const it of items) (getY(it) < atY ? top : bottom).push(it)
  return { top, bottom }
}
