import { useEffect, useState } from 'react'

/**
 * Espera a que las tipografías indicadas estén cargadas antes de dibujar
 * texto en Konva, evitando que se renderice con una fuente fallback (RNF-06).
 * Pasa las familias por nombre (p. ej. "Great Vibes").
 *
 * El estado solo se actualiza en el callback de la promesa; `ready` se deriva
 * comparando la clave resuelta con la actual, así un cambio de familias
 * vuelve a `false` hasta que las nuevas estén listas.
 */
export function useFontsReady(families: string[]): boolean {
  const key = families.join('|')
  const [readyKey, setReadyKey] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const loads = key
      ? key.split('|').map((f) => document.fonts.load(`16px "${f}"`))
      : []
    Promise.allSettled(loads)
      .then(() => document.fonts.ready)
      .then(() => {
        if (!cancelled) setReadyKey(key)
      })
    return () => {
      cancelled = true
    }
  }, [key])

  return readyKey === key
}
