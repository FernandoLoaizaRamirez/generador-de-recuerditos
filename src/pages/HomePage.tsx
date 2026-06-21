import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import type { Project } from '../types'
import { deleteProject, duplicateProject, listProjects } from '../lib/db'
import { getTemplate } from '../templates'
import { useBlobUrl } from '../hooks/useBlobUrl'

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const thumb = useBlobUrl(project.thumbnailBlobId)
  const templateName = getTemplate(project.templateId)?.name ?? 'Plantilla'

  return (
    <li className="overflow-hidden rounded-xl border border-brand-gold-soft bg-white shadow-sm">
      <button
        type="button"
        onClick={() => navigate(`/editor/${project.id}`)}
        className="block w-full"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-brand-pink-soft">
          {thumb ? (
            <img
              src={thumb}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-brand-ink/40">
              sin vista previa
            </div>
          )}
        </div>
      </button>
      <div className="px-3 py-2.5">
        <p className="truncate text-sm font-medium">{project.name}</p>
        <p className="text-xs text-brand-ink/50">
          {templateName} · {formatDate(project.updatedAt)}
        </p>
        <div className="mt-2 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate(`/editor/${project.id}`)}
            className="rounded-md bg-brand-gold px-2.5 py-1 font-medium text-white"
          >
            Abrir
          </button>
          <button
            type="button"
            onClick={() => void duplicateProject(project.id)}
            className="rounded-md border border-brand-gold-soft px-2.5 py-1"
          >
            Duplicar
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Eliminar "${project.name}"?`))
                void deleteProject(project.id)
            }}
            className="rounded-md border border-red-200 px-2.5 py-1 text-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  )
}

/** Inicio: lista de proyectos guardados localmente (IndexedDB, en vivo). */
export function HomePage() {
  const navigate = useNavigate()
  const projects = useLiveQuery(() => listProjects(), [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Mis proyectos</h2>
      </div>

      {projects === undefined ? (
        <p className="text-sm text-brand-ink/50">Cargando…</p>
      ) : projects.length === 0 ? (
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
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard
              key={`${p.id}:${p.thumbnailBlobId ?? 'none'}`}
              project={p}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
