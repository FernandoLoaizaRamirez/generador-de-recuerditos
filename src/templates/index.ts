import type { TemplateCategory, TemplateDef } from '../types'
import { xvMariposasOro } from './xv-mariposas-oro'
import { bodaArcoEucalipto } from './boda-arco-eucalipto'
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
  bodaArcoEucalipto,
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

/**
 * Comprobación de formato, solo en desarrollo.
 *
 * Todo el catálogo es un CABALLETE PLEGABLE: hoja VERTICAL de 4×6" (1200×1800
 * a 300 DPI) que se dobla por la mitad. Si una plantilla se sale de ahí —un
 * lienzo apaisado, o un doblez que no cae en el centro— la pieza no cierra al
 * doblarla y el fallo no se ve hasta que ya está impresa.
 *
 * Se avisa al abrir la app en dev y no en producción: es un error de autoría,
 * no algo que deba tumbar el sitio de un cliente.
 */
if (import.meta.env.DEV) {
  const problemas = templates.flatMap((t) => {
    const { width, height } = t.canvas
    const errs: string[] = []
    if (width !== 1200 || height !== 1800)
      errs.push(`lienzo ${width}×${height}, se espera 1200×1800 (vertical 2:3)`)
    if (height <= width) errs.push('el lienzo tiene que ser VERTICAL')
    if (!t.fold) errs.push('le falta `fold`: sin doblez no es un caballete')
    else if (t.fold.atY !== height / 2)
      errs.push(
        `dobla en y=${t.fold.atY}, tiene que ser el centro (${height / 2})`,
      )
    return errs.map((e) => `  · ${t.id}: ${e}`)
  })
  if (problemas.length > 0) {
    console.error('Plantillas con formato inválido:\n' + problemas.join('\n'))
  }
}

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

/**
 * Las destacadas, en el orden del registro. La galería las pone en una
 * sección propia al principio para no tener que buscarlas entre las 21;
 * siguen apareciendo además en su categoría, que es como se navega por evento.
 */
export function featuredTemplates(): TemplateDef[] {
  return templates.filter((t) => t.featured)
}

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
