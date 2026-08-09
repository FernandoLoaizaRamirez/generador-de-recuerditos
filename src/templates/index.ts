import type { TemplateCategory, TemplateDef } from '../types'
import { xvMariposasOro } from './xv-mariposas-oro'
import { universal } from './universal'
import { deluxeValentina } from './deluxe-valentina'
import { bodaBlancoOro } from './boda-blanco-oro'
import { mariposasDoradas } from './mariposas-doradas'
import { eleganteDorado } from './elegante-dorado'
import { corazonesRosados } from './corazones-rosados'
import { azulCristal } from './azul-cristal'
import { lilaEncanto } from './lila-encanto'
import { bosqueEncantado } from './bosque-encantado'
import { nocheEstelar } from './noche-estelar'
import { duraznoSuave } from './durazno-suave'
import { rojoPasion } from './rojo-pasion'
import { tropicalEsmeralda } from './tropical-esmeralda'
import { glamNegroOro } from './glam-negro-oro'
import { atardecerCoral } from './atardecer-coral'
import { aquaMenta } from './aqua-menta'
import { consolaNeon } from './consola-neon'
import { mallaCyber } from './malla-cyber'
import { togaDigital } from './toga-digital'

/**
 * Registro central de plantillas. Para agregar una plantilla nueva basta
 * con definir su `TemplateDef` (+ assets) e incluirla en este arreglo; el
 * editor y el exportador la consumen sin cambios (RNF-08).
 */
export const templates: TemplateDef[] = [
  // --- Colección Premium ---
  xvMariposasOro,
  // --- Catálogo previo ---
  universal,
  consolaNeon,
  mallaCyber,
  togaDigital,
  bodaBlancoOro,
  deluxeValentina,
  mariposasDoradas,
  eleganteDorado,
  corazonesRosados,
  azulCristal,
  lilaEncanto,
  bosqueEncantado,
  nocheEstelar,
  duraznoSuave,
  rojoPasion,
  tropicalEsmeralda,
  glamNegroOro,
  atardecerCoral,
  aquaMenta,
]

/** Busca una plantilla por id. */
export function getTemplate(id: string): TemplateDef | undefined {
  return templates.find((t) => t.id === id)
}

/**
 * Categorías en el orden en que se muestran en la galería.
 *
 * La etiqueta visible vive aquí y no dentro de cada plantilla: renombrar una
 * sección (o reordenarlas) no obliga a tocar ningún `TemplateDef`.
 */
export const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'xv', label: 'XV Años' },
  { id: 'boda', label: 'Boda' },
  { id: 'graduacion', label: 'Graduación' },
]

export interface TemplateGroup {
  id: TemplateCategory
  label: string
  items: TemplateDef[]
}

/**
 * Agrupa el catálogo por categoría. Las secciones salen en el orden de
 * `CATEGORIES` y, dentro de cada una, en el orden de `templates` (por eso las
 * premium van primero). Omite las categorías que aún no tienen plantillas.
 */
export function templatesByCategory(): TemplateGroup[] {
  return CATEGORIES.map((c) => ({
    ...c,
    items: templates.filter((t) => t.category === c.id),
  })).filter((g) => g.items.length > 0)
}
