import { Link, useParams } from 'react-router-dom'
import { getTemplate } from '../templates'
import { TemplateCanvas } from '../components/TemplateCanvas'

/**
 * Vista previa de una plantilla renderizada a medidas reales en el lienzo
 * (modo solo lectura en la Fase 1). El botón "Usar esta plantilla" abrirá
 * el editor en la Fase 2.
 */
export function TemplatePreviewPage() {
  const { templateId } = useParams()
  const template = templateId ? getTemplate(templateId) : undefined

  if (!template) {
    return (
      <div className="rounded-xl border border-dashed border-brand-gold-soft bg-white/60 p-10 text-center">
        <p className="text-brand-ink/70">No se encontró la plantilla.</p>
        <Link
          to="/plantillas"
          className="mt-4 inline-block text-sm font-medium text-brand-gold underline"
        >
          ← Volver a la galería
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <Link
            to="/plantillas"
            className="text-sm text-brand-ink/60 hover:text-brand-ink"
          >
            ← Galería
          </Link>
          <h2 className="text-lg font-medium">{template.name}</h2>
        </div>
        <button
          type="button"
          disabled
          title="Disponible en la Fase 2"
          className="cursor-not-allowed rounded-lg bg-brand-gold/50 px-4 py-2 text-sm font-medium text-white"
        >
          Usar esta plantilla
        </button>
      </div>

      <div className="mx-auto max-w-[460px]">
        <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-brand-gold-soft">
          <TemplateCanvas template={template} />
        </div>
        <p className="mt-3 text-center text-xs text-brand-ink/50">
          Vista previa a escala · tamaño real {template.canvas.width}×
          {template.canvas.height} px (4×6&quot; @ 300 DPI)
        </p>
      </div>
    </div>
  )
}
