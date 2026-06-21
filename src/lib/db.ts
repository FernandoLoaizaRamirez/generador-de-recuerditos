import Dexie, { type Table } from 'dexie'
import type { BusinessProfile, Project } from '../types'

/** Registro de imagen original almacenada como Blob. */
interface ImageRecord {
  id: string
  blob: Blob
}

/** Perfil del negocio con clave fija. */
interface ProfileRecord extends BusinessProfile {
  id: 'default'
}

/**
 * Base de datos local (IndexedDB vía Dexie). Sin servidor: las fotos y los
 * proyectos viven solo en el dispositivo (RNF-04, RNF-07).
 */
class RecuerditosDB extends Dexie {
  projects!: Table<Project, string>
  images!: Table<ImageRecord, string>
  profile!: Table<ProfileRecord, string>

  constructor() {
    super('recuerditos')
    this.version(1).stores({
      projects: 'id, updatedAt, templateId',
      images: 'id',
      profile: 'id',
    })
  }
}

export const db = new RecuerditosDB()

const uuid = () => crypto.randomUUID()

// ---------- Imágenes ----------

/** Guarda un Blob de imagen y devuelve su id. */
export async function putImage(blob: Blob): Promise<string> {
  const id = uuid()
  await db.images.put({ id, blob })
  return id
}

export async function getImageBlob(id: string): Promise<Blob | undefined> {
  return (await db.images.get(id))?.blob
}

export async function deleteImage(id: string): Promise<void> {
  await db.images.delete(id)
}

// ---------- Proyectos ----------

export async function saveProject(project: Project): Promise<void> {
  await db.projects.put({ ...project, updatedAt: Date.now() })
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id)
}

export async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray()
}

/** Ids de todas las imágenes referenciadas por un proyecto. */
function imageIdsOf(project: Project): string[] {
  const ids = Object.values(project.slots)
    .map((s) => s.imageBlobId)
    .filter((v): v is string => !!v)
  if (project.thumbnailBlobId) ids.push(project.thumbnailBlobId)
  return ids
}

/** Borra un proyecto y sus imágenes asociadas. */
export async function deleteProject(id: string): Promise<void> {
  const project = await db.projects.get(id)
  await db.transaction('rw', db.projects, db.images, async () => {
    if (project) {
      await Promise.all(imageIdsOf(project).map((imgId) => deleteImage(imgId)))
    }
    await db.projects.delete(id)
  })
}

/** Duplica un proyecto copiando también sus imágenes (ids nuevos). */
export async function duplicateProject(
  id: string,
): Promise<Project | undefined> {
  const original = await db.projects.get(id)
  if (!original) return undefined

  // Copiar cada imagen a un id nuevo y mapear referencias.
  const idMap = new Map<string, string>()
  for (const oldId of imageIdsOf(original)) {
    const blob = await getImageBlob(oldId)
    if (blob) idMap.set(oldId, await putImage(blob))
  }

  const now = Date.now()
  const copy: Project = {
    ...structuredClone(original),
    id: uuid(),
    name: `${original.name} (copia)`,
    createdAt: now,
    updatedAt: now,
    thumbnailBlobId: original.thumbnailBlobId
      ? idMap.get(original.thumbnailBlobId)
      : undefined,
    slots: Object.fromEntries(
      Object.entries(original.slots).map(([slotId, s]) => [
        slotId,
        {
          ...s,
          imageBlobId: s.imageBlobId ? idMap.get(s.imageBlobId) : undefined,
        },
      ]),
    ),
  }
  await db.projects.put(copy)
  return copy
}

// ---------- Perfil del negocio ----------

export async function getProfile(): Promise<BusinessProfile | undefined> {
  return db.profile.get('default')
}

export async function saveProfile(profile: BusinessProfile): Promise<void> {
  await db.profile.put({ ...profile, id: 'default' })
}
