import type { TemplateDef } from '../types'

/**
 * Registro central de plantillas. Para agregar una plantilla nueva basta
 * con definir su `TemplateDef` (+ assets) e incluirla en este arreglo; el
 * editor y el exportador la consumen sin cambios (RNF-08).
 *
 * Vacío en la Fase 0. La primera plantilla («Mariposas Doradas»), basada en
 * el arte de referencia, se define en la Fase 1.
 */
export const templates: TemplateDef[] = []

/** Busca una plantilla por id. */
export function getTemplate(id: string): TemplateDef | undefined {
  return templates.find((t) => t.id === id)
}
