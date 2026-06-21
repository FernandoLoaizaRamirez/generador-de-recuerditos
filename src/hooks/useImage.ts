import { useEffect, useState } from 'react'

export type ImageStatus = 'loading' | 'loaded' | 'failed'

interface Loaded {
  src: string
  image: HTMLImageElement | undefined
  status: ImageStatus
}

/**
 * Carga una imagen como HTMLImageElement para usarla en Konva.
 * El estado solo se actualiza en los callbacks de carga (no de forma
 * síncrona en el efecto); el resultado se deriva comparando el `src`
 * cargado con el actual, de modo que un cambio de `src` "reinicia" solo.
 */
export function useImage(
  src: string | undefined,
): [HTMLImageElement | undefined, ImageStatus] {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    const img = new window.Image()
    img.onload = () => {
      if (!cancelled) setLoaded({ src, image: img, status: 'loaded' })
    }
    img.onerror = () => {
      if (!cancelled) setLoaded({ src, image: undefined, status: 'failed' })
    }
    img.src = src
    return () => {
      cancelled = true
      img.onload = null
      img.onerror = null
    }
  }, [src])

  if (!src) return [undefined, 'failed']
  if (loaded && loaded.src === src) return [loaded.image, loaded.status]
  return [undefined, 'loading']
}
