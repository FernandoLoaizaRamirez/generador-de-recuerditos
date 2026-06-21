import { lazy } from 'react'

/**
 * Páginas con lienzo Konva cargadas de forma diferida (code-splitting): así
 * Konva y jsPDF no entran en el bundle inicial; se descargan al entrar al
 * editor o a la vista previa. Este archivo solo exporta componentes para no
 * romper el fast-refresh del router.
 */
export const TemplatePreviewPage = lazy(() =>
  import('./pages/TemplatePreviewPage').then((m) => ({
    default: m.TemplatePreviewPage,
  })),
)

export const EditorPage = lazy(() =>
  import('./pages/EditorPage').then((m) => ({ default: m.EditorPage })),
)
