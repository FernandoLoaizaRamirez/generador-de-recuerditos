import { useCallback, useRef, useState } from 'react'

/**
 * Mide el tamaño de un contenedor para escalar el lienzo de forma
 * responsiva en PC y tablet (RNF-03).
 *
 * Usa un callback ref: mide de forma síncrona en cuanto el nodo se monta
 * (robusto, no depende del primer callback de ResizeObserver) y luego
 * escucha cambios con ResizeObserver. Al ser un ref callback —no un efecto—
 * la actualización de estado inicial es válida.
 */
export function useContainerSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const roRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback((el: T | null) => {
    roRef.current?.disconnect()
    if (!el) return
    const measure = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    roRef.current = ro
  }, [])

  return { ref, ...size }
}
