import type { TemplateDef } from '../types'
import { mariposasDoradas } from './mariposas-doradas'
import { eleganteDorado } from './elegante-dorado'

/**
 * Registro central de plantillas. Para agregar una plantilla nueva basta
 * con definir su `TemplateDef` (+ assets) e incluirla en este arreglo; el
 * editor y el exportador la consumen sin cambios (RNF-08).
 */
export const templates: TemplateDef[] = [mariposasDoradas, eleganteDorado]

/** Busca una plantilla por id. */
export function getTemplate(id: string): TemplateDef | undefined {
  return templates.find((t) => t.id === id)
}
