import { useNavigate } from 'react-router-dom'
import type { TemplateDef } from '../types'
import { featuredTemplates, templates, templatesByCategory } from '../templates'

function TemplateCard({ template }: { template: TemplateDef }) {
  const navigate = useNavigate()
  return (
    <li>
      <button
        type="button"
        onClick={() => navigate(`/plantillas/${template.id}`)}
        className="group block w-full overflow-hidden rounded-xl border border-brand-gold-soft bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-brand-pink-soft">
          <img
            src={template.thumbnail}
            alt={`Plantilla ${template.name}`}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="px-3 py-2.5">
          <p className="truncate text-sm font-medium">{template.name}</p>
          <p className="text-xs text-brand-ink/50">4×6&quot; · 300 DPI</p>
        </div>
      </button>
    </li>
  )
}

/**
 * Galería de plantillas (RF-01), agrupada por evento. El orden de las
 * secciones y su rótulo salen de `CATEGORIES`; dentro de cada sección manda
 * el orden del registro `templates`.
 *
 * Las destacadas van además en una sección propia al principio: son los
 * diseños nuevos y estaban repartidos entre categorías, así que había que
 * buscarlos entre los 21. Siguen apareciendo en su categoría porque es como
 * se navega cuando ya sabes qué evento tienes entre manos.
 */
export function GalleryPage() {
  const groups = templatesByCategory()
  const featured = featuredTemplates()
  const plural = (n: number) => (n === 1 ? '' : 's')

  return (
    <section>
      <h2 className="mb-1 text-lg font-medium">Elige una plantilla</h2>
      <p className="mb-8 text-sm text-brand-ink/60">
        {templates.length} plantilla{plural(templates.length)} disponible
        {plural(templates.length)} en {groups.length} categoría
        {plural(groups.length)}.
      </p>

      {featured.length > 0 && (
        <section className="mb-10 rounded-xl border border-brand-gold-soft bg-brand-pink-soft/40 p-4 sm:p-5">
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-base font-semibold tracking-tight">
              ✦ Diseños nuevos
            </h3>
            <span className="text-xs text-brand-ink/50">
              también están en su categoría
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.id}>
            <div className="mb-4 flex items-baseline gap-3 border-b border-brand-gold-soft pb-2">
              <h3 className="text-base font-semibold tracking-tight">
                {group.label}
              </h3>
              <span className="text-xs text-brand-ink/50">
                {group.items.length} plantilla{plural(group.items.length)}
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
