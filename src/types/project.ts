/**
 * Esquema de un PROYECTO: el contenido que el usuario coloca sobre una
 * plantilla. Es lo que se guarda en IndexedDB. Las imágenes se almacenan
 * como Blobs separados y aquí solo se referencian por id.
 */

/** Encuadre de una foto dentro de su hueco (zoom + paneo + rotación). */
export interface SlotTransform {
  /** Escala de zoom (1 = ajuste base según `defaultFit` del hueco). */
  scale: number
  /** Desplazamiento de paneo en px respecto al centro del hueco. */
  offsetX: number
  offsetY: number
  /** Rotación en grados (sentido horario). */
  rotation: number
}

/** Estado de un hueco de foto en un proyecto. */
export interface ProjectSlot {
  /** Id del Blob de la imagen ORIGINAL en IndexedDB (alta resolución). */
  imageBlobId?: string
  transform: SlotTransform
}

/** Ajustes que el usuario puede sobreescribir sobre un campo de texto. */
export interface ProjectTextOverride {
  color?: string
  fontSize?: number
}

/** Estado de un campo de texto en un proyecto. */
export interface ProjectText {
  value: string
  overrides?: ProjectTextOverride
}

/** Proyecto guardado por el usuario. */
export interface Project {
  id: string
  name: string
  templateId: string
  /** Marcas de tiempo en epoch ms. */
  createdAt: number
  updatedAt: number
  /** Id del Blob de la miniatura en IndexedDB. */
  thumbnailBlobId?: string
  /** Estado por hueco, indexado por `PhotoSlot.id`. */
  slots: Record<string, ProjectSlot>
  /** Estado por campo, indexado por `TextField.id`. */
  texts: Record<string, ProjectText>
}

/** Perfil reutilizable del negocio (autocompleta la marca en cada proyecto). */
export interface BusinessProfile {
  name: string
  phone: string
  /** Id del Blob del logo en IndexedDB. */
  logoBlobId?: string
}

/** Transform neutral por defecto para un hueco recién creado. */
export const DEFAULT_SLOT_TRANSFORM: SlotTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
}
