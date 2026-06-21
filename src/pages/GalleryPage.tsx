import { useNavigate } from 'react-router-dom'
import { templates } from '../templates'

/** Galería de plantillas (RF-01). Al elegir una se abre su vista previa. */
export function GalleryPage() {
  const navigate = useNavigate()
  return (
    <section>
      <h2 className="mb-1 text-lg font-medium">Elige una plantilla</h2>
      <p className="mb-6 text-sm text-brand-ink/60">
        {templates.length} plantilla{templates.length === 1 ? '' : 's'}{' '}
        disponible{templates.length === 1 ? '' : 's'}.
      </p>

      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {templates.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => navigate(`/plantillas/${t.id}`)}
              className="group block w-full overflow-hidden rounded-xl border border-brand-gold-soft bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-brand-pink-soft">
                <img
                  src={t.thumbnail}
                  alt={`Plantilla ${t.name}`}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="text-xs text-brand-ink/50">4×6&quot; · 300 DPI</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
