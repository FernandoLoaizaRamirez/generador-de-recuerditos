import { templates } from './templates'

/**
 * Shell base de la app (Fase 0). Pantalla de inicio con marca y accesos
 * placeholder a "Mis proyectos" y "Nuevo recuerdo". La galería real, el
 * editor y la persistencia llegan en las Fases 1–3.
 */
function App() {
  return (
    <div className="flex min-h-full flex-col bg-brand-pink-soft text-brand-ink">
      <header className="border-b border-brand-gold-soft bg-white/70 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Generador de Recuerditos
            </h1>
            <p className="text-sm text-brand-ink/60">
              Caballetes de XV años · listos para imprimir en 4×6&quot;
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
          >
            + Nuevo recuerdo
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <section>
          <h2 className="mb-4 text-lg font-medium">Mis proyectos</h2>
          <div className="rounded-xl border border-dashed border-brand-gold-soft bg-white/60 p-10 text-center">
            <p className="text-brand-ink/70">
              Aún no tienes recuerdos guardados.
            </p>
            <p className="mt-1 text-sm text-brand-ink/50">
              La galería de plantillas y el editor llegan en la Fase 1.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-medium">
            Plantillas disponibles{' '}
            <span className="text-sm font-normal text-brand-ink/50">
              ({templates.length})
            </span>
          </h2>
          {templates.length === 0 ? (
            <p className="text-sm text-brand-ink/50">
              Andamiaje listo. La primera plantilla («Mariposas Doradas») se
              definirá en la Fase 1.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {templates.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-brand-gold-soft bg-white p-3 text-sm"
                >
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-brand-ink/40">
        Fase 0 — Fundaciones · Vite + React + TS + Tailwind
      </footer>
    </div>
  )
}

export default App
