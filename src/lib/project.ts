import type {
  BusinessProfile,
  Project,
  ProjectSlot,
  ProjectText,
  TemplateDef,
} from '../types'
import { DEFAULT_SLOT_TRANSFORM } from '../types'

/**
 * Crea un proyecto nuevo a partir de una plantilla. Inicializa los huecos
 * vacíos y autocompleta los campos de marca (negocio/teléfono) desde el
 * Perfil del negocio (RF-23).
 */
export function createProjectFromTemplate(
  template: TemplateDef,
  profile?: BusinessProfile,
): Project {
  const now = Date.now()

  const slots: Record<string, ProjectSlot> = {}
  for (const slot of template.photoSlots) {
    slots[slot.id] = { transform: { ...DEFAULT_SLOT_TRANSFORM } }
  }

  const texts: Record<string, ProjectText> = {}
  for (const field of template.textFields) {
    let value = ''
    if (field.role === 'businessName') value = profile?.name ?? ''
    else if (field.role === 'phone') value = profile?.phone ?? ''
    texts[field.id] = { value }
  }

  return {
    id: crypto.randomUUID(),
    name: 'Recuerdo sin título',
    templateId: template.id,
    createdAt: now,
    updatedAt: now,
    slots,
    texts,
  }
}
