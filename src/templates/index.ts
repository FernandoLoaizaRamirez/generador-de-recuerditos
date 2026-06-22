import type { TemplateDef } from '../types'
import { mariposasDoradas } from './mariposas-doradas'
import { eleganteDorado } from './elegante-dorado'
import { corazonesRosados } from './corazones-rosados'
import { azulCristal } from './azul-cristal'
import { lilaEncanto } from './lila-encanto'
import { bosqueEncantado } from './bosque-encantado'
import { nocheEstelar } from './noche-estelar'

/**
 * Registro central de plantillas. Para agregar una plantilla nueva basta
 * con definir su `TemplateDef` (+ assets) e incluirla en este arreglo; el
 * editor y el exportador la consumen sin cambios (RNF-08).
 */
export const templates: TemplateDef[] = [
  mariposasDoradas,
  eleganteDorado,
  corazonesRosados,
  azulCristal,
  lilaEncanto,
  bosqueEncantado,
  nocheEstelar,
]

/** Busca una plantilla por id. */
export function getTemplate(id: string): TemplateDef | undefined {
  return templates.find((t) => t.id === id)
}
