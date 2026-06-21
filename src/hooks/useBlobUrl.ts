import { useEffect, useState } from 'react'
import { getImageBlob } from '../lib/db'

/**
 * Crea un object URL para una imagen guardada en IndexedDB y lo libera al
 * desmontar. Pensado para usarse con un `key` estable por blobId (el
 * componente se remonta si cambia la imagen).
 */
export function useBlobUrl(blobId?: string): string | undefined {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!blobId) return
    let cancelled = false
    let created: string | undefined
    getImageBlob(blobId).then((blob) => {
      if (cancelled || !blob) return
      created = URL.createObjectURL(blob)
      setUrl(created)
    })
    return () => {
      cancelled = true
      if (created) URL.revokeObjectURL(created)
    }
  }, [blobId])

  return url
}
