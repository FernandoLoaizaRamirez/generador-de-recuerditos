import { useEffect, useState } from 'react'
import type { Project } from '../types'
import { getImageBlob } from '../lib/db'
import { blobToPreviewImage } from '../lib/image'

/**
 * Carga las imágenes (versión preview) de los huecos que tienen foto.
 * Se recarga solo cuando cambia la foto de algún hueco (no al hacer
 * zoom/paneo, que no alteran `imageBlobId`).
 */
export function useSlotImages(
  project: Project | null,
): Record<string, HTMLImageElement> {
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})

  // Clave estable: "slotId:blobId|slotId:blobId|...". slotId y blobId (uuid)
  // no contienen ':' ni '|', así que se puede reconstruir desde la clave.
  const key = project
    ? Object.entries(project.slots)
        .map(([id, s]) => `${id}:${s.imageBlobId ?? ''}`)
        .join('|')
    : ''

  useEffect(() => {
    let cancelled = false
    const pairs = key ? key.split('|').map((p) => p.split(':')) : []
    const toLoad = pairs.filter(([, blobId]) => blobId)

    Promise.all(
      toLoad.map(async ([slotId, blobId]) => {
        const blob = await getImageBlob(blobId)
        if (!blob) return null
        const img = await blobToPreviewImage(blob)
        return [slotId, img] as const
      }),
    ).then((results) => {
      if (cancelled) return
      const map: Record<string, HTMLImageElement> = {}
      for (const r of results) if (r) map[r[0]] = r[1]
      setImages(map)
    })

    return () => {
      cancelled = true
    }
  }, [key])

  return images
}
