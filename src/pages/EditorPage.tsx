import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import { getTemplate } from '../templates'
import { deleteImage, getProject, putImage, saveProject } from '../lib/db'
import { EditorCanvas } from '../components/EditorCanvas'
import { SlotPanel } from '../components/editor/SlotPanel'
import { TextPanel } from '../components/editor/TextPanel'

export function EditorPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const init = useEditorStore((s) => s.init)
  const project = useEditorStore((s) => s.project)
  const template = useEditorStore((s) => s.template)
  const dirty = useEditorStore((s) => s.dirty)
  const past = useEditorStore((s) => s.past)
  const future = useEditorStore((s) => s.future)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const setName = useEditorStore((s) => s.setName)

  const [loadError, setLoadError] = useState(false)
  const stageRef = useRef<Konva.Stage>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingSlotRef = useRef<string | null>(null)

  // Cargar proyecto + plantilla en el store.
  useEffect(() => {
    let cancelled = false
    if (!projectId) return
    void (async () => {
      const loaded = await getProject(projectId)
      const tpl = loaded ? getTemplate(loaded.templateId) : undefined
      if (cancelled) return
      if (!loaded || !tpl) {
        setLoadError(true)
        return
      }
      init(tpl, loaded)
    })()
    return () => {
      cancelled = true
    }
  }, [projectId, init])

  // Limpiar el store al salir.
  useEffect(() => () => useEditorStore.getState().reset(), [])

  const save = useCallback(async () => {
    const current = useEditorStore.getState().project
    if (!current) return
    let thumbnailBlobId = current.thumbnailBlobId
    const stage = stageRef.current
    if (stage) {
      try {
        const dataUrl = stage.toDataURL({
          pixelRatio: 0.3,
          mimeType: 'image/jpeg',
          quality: 0.8,
        })
        const blob = await (await fetch(dataUrl)).blob()
        if (thumbnailBlobId) await deleteImage(thumbnailBlobId)
        thumbnailBlobId = await putImage(blob)
      } catch {
        // Si falla la miniatura, igual guardamos el proyecto.
      }
    }
    const updated = { ...current, thumbnailBlobId, updatedAt: Date.now() }
    await saveProject(updated)
    useEditorStore.getState().applySaved(updated)
  }, [])

  // Autoguardado con debounce tras cada cambio (RF-32).
  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => void save(), 1200)
    return () => clearTimeout(t)
  }, [dirty, project, save])

  const requestUpload = (slotId: string) => {
    pendingSlotRef.current = slotId
    fileInputRef.current?.click()
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const slotId = pendingSlotRef.current
    e.target.value = ''
    if (!file || !slotId) return
    const id = await putImage(file)
    useEditorStore.getState().setSlotImage(slotId, id)
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-dashed border-brand-gold-soft bg-white/60 p-10 text-center">
        <p className="text-brand-ink/70">No se encontró el proyecto.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-brand-gold underline"
        >
          ← Volver a Mis proyectos
        </Link>
      </div>
    )
  }

  if (!project || !template) {
    return <p className="text-center text-brand-ink/60">Cargando editor…</p>
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Barra superior */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm text-brand-ink/60 hover:text-brand-ink"
          >
            ← Mis proyectos
          </Link>
          <input
            value={project.name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-brand-gold-soft bg-white px-2 py-1 text-sm font-medium"
            aria-label="Nombre del proyecto"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={past.length === 0}
            className="rounded-md border border-brand-gold-soft bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ↶ Deshacer
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={future.length === 0}
            className="rounded-md border border-brand-gold-soft bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ↷ Rehacer
          </button>
          <span className="text-xs text-brand-ink/50">
            {dirty ? 'Guardando…' : 'Guardado ✓'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="mx-auto w-full max-w-[460px] lg:mx-0">
          <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-brand-gold-soft">
            <EditorCanvas stageRef={stageRef} onRequestUpload={requestUpload} />
          </div>
          <p className="mt-2 text-center text-xs text-brand-ink/50">
            Toca un hueco para subir una foto · arrastra para encuadrar · rueda
            para acercar
          </p>
        </div>

        <div className="space-y-6">
          <SlotPanel onRequestUpload={requestUpload} />
          <TextPanel />
          <button
            type="button"
            onClick={() => void save()}
            className="w-full rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate(`/plantillas/${template.id}`)}
            className="w-full rounded-lg border border-brand-gold-soft bg-white px-4 py-2 text-sm"
          >
            Ver plantilla original
          </button>
        </div>
      </div>
    </div>
  )
}
