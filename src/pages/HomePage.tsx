import { useNavigate } from 'react-router-dom'

/** Inicio: "Mis proyectos" (vacío en Fase 1, persistencia llega en Fase 2). */
export function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-medium">Mis proyectos</h2>
        <div className="rounded-xl border border-dashed border-brand-gold-soft bg-white/60 p-10 text-center">
          <p className="text-brand-ink/70">
            Aún no tienes recuerdos guardados.
          </p>
          <button
            type="button"
            onClick={() => navigate('/plantillas')}
            className="mt-4 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
          >
            Crear mi primer recuerdo
          </button>
          <p className="mt-3 text-xs text-brand-ink/50">
            El guardado local de proyectos llega en la Fase 2.
          </p>
        </div>
      </section>
    </div>
  )
}
