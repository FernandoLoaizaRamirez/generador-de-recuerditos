import { Link, Outlet, useNavigate } from 'react-router-dom'

/** Marco responsivo de la app: cabecera con marca + navegación, y contenido. */
export function AppShell() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-full flex-col bg-brand-pink-soft text-brand-ink">
      <header className="border-b border-brand-gold-soft bg-white/70 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link to="/" className="block">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Generador de Recuerditos
            </h1>
            <p className="text-xs text-brand-ink/60 sm:text-sm">
              Caballetes de XV años · listos para imprimir en 4×6&quot;
            </p>
          </Link>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/perfil"
              className="hidden text-sm text-brand-ink/60 hover:text-brand-ink sm:inline"
            >
              Perfil
            </Link>
            <button
              type="button"
              onClick={() => navigate('/plantillas')}
              className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
            >
              + Nuevo recuerdo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="px-6 py-4 text-center text-xs text-brand-ink/40">
        Fase 2 — Editor · Vite + React + TS + Tailwind + Konva + Dexie
      </footer>
    </div>
  )
}
