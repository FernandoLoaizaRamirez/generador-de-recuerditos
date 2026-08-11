import { useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import type { Project, TemplateDef } from '../../types'
import {
  downloadBlob,
  prepareExportImages,
  resolutionWarnings,
  safeFileName,
  stageToJpg,
  stageToPdf,
  stageToPng,
  type ExportImages,
} from '../../lib/export'
import { DPI } from '../../lib/print'
import { ExportStage } from '../ExportStage'

interface Props {
  project: Project
  template: TemplateDef
  onClose: () => void
}

const PREVIEW_W = 280

/**
 * A dónde va el archivo. Antes esto era una casilla de «incluir sangrado»
 * marcada por defecto, y el pie decía «Tamaño final: 4×6"» aunque el archivo
 * saliera de 4,25×6,25: quien lo llevaba a imprimir fotos 4×6 se encontraba
 * con que el laboratorio se lo escalaba o recortaba.
 *
 * Ahora se elige el destino y el pie canta las medidas REALES.
 */
type Destino = 'foto' | 'imprenta'

/** Píxeles a pulgadas a 300 DPI, sin decimales de más: 4, 6, 4.25… */
const inchLabel = (px: number) =>
  Number((px / DPI).toFixed(2))
    .toString()
    .replace('.', ',')

export function ExportModal({ project, template, onClose }: Props) {
  const [images, setImages] = useState<ExportImages | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  // Por defecto, 4×6 exacto: es el caso normal del negocio.
  const [destino, setDestino] = useState<Destino>('foto')
  const [cropMarks, setCropMarks] = useState(false)
  const withBleed = destino === 'imprenta'
  const stageRef = useRef<Konva.Stage>(null)

  useEffect(() => {
    let cancelled = false
    let revokeFn: (() => void) | undefined
    void (async () => {
      const { images: imgs, revoke } = await prepareExportImages(
        project,
        template,
      )
      if (cancelled) {
        revoke()
        return
      }
      revokeFn = revoke
      setImages(imgs)
      setWarnings(resolutionWarnings(project, template, imgs.slotImages))
      setLoading(false)
    })()
    return () => {
      cancelled = true
      revokeFn?.()
    }
  }, [project, template])

  const doExport = async (format: 'pdf' | 'png' | 'jpg') => {
    const stage = stageRef.current
    if (!stage) return
    setBusy(format)
    try {
      await document.fonts.ready
      await new Promise((r) => setTimeout(r, 60))
      const base = safeFileName(project.name)
      if (format === 'pdf') {
        downloadBlob(stageToPdf(stage), `${base}.pdf`)
      } else if (format === 'png') {
        downloadBlob(await stageToPng(stage), `${base}.png`)
      } else {
        downloadBlob(await stageToJpg(stage), `${base}.jpg`)
      }
    } finally {
      setBusy(null)
    }
  }

  // Geometría de la vista previa escalada.
  const W = template.canvas.width
  const H = template.canvas.height
  const b = withBleed ? template.canvas.bleedPx : 0
  const safe = template.canvas.safePx
  const fullW = W + 2 * b
  const fullH = H + 2 * b
  const s = PREVIEW_W / fullW

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exportar para imprimir</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-brand-ink/60 hover:bg-brand-pink-soft"
          >
            ✕
          </button>
        </div>

        {loading || !images ? (
          <p className="py-10 text-center text-brand-ink/60">
            Preparando imágenes en alta resolución…
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-[280px_1fr]">
            {/* Vista previa con guías */}
            <div>
              <div
                className="relative mx-auto overflow-hidden rounded-lg ring-1 ring-brand-gold-soft"
                style={{ width: PREVIEW_W, height: fullH * s }}
              >
                <div
                  style={{
                    transform: `scale(${s})`,
                    transformOrigin: 'top left',
                    width: fullW,
                    height: fullH,
                  }}
                >
                  <ExportStage
                    project={project}
                    template={template}
                    images={images}
                    withBleed={withBleed}
                    cropMarks={cropMarks}
                    stageRef={stageRef}
                  />
                </div>
                {/* Línea de corte (trim) */}
                <div
                  className="pointer-events-none absolute border border-dashed border-red-400"
                  style={{
                    left: b * s,
                    top: b * s,
                    width: W * s,
                    height: H * s,
                  }}
                />
                {/* Zona segura */}
                <div
                  className="pointer-events-none absolute border border-dashed border-green-500/70"
                  style={{
                    left: (b + safe) * s,
                    top: (b + safe) * s,
                    width: (W - 2 * safe) * s,
                    height: (H - 2 * safe) * s,
                  }}
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-brand-ink/50">
                <span className="text-red-400">— corte</span> ·{' '}
                <span className="text-green-600">— zona segura</span>
              </p>
            </div>

            {/* Opciones y descarga */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-brand-ink/70">
                  ¿A dónde lo vas a llevar?
                </p>
                {(
                  [
                    {
                      id: 'foto',
                      titulo: 'Laboratorio de fotos — 4×6 exacto',
                      ayuda: `${W} × ${H} px, sin márgenes que recortar`,
                    },
                    {
                      id: 'imprenta',
                      titulo: 'Imprenta — con sangrado',
                      ayuda: `${fullW} × ${fullH} px, para recortar a 4×6 después`,
                    },
                  ] as const
                ).map((op) => (
                  <label
                    key={op.id}
                    className={`flex cursor-pointer gap-2 rounded-lg border p-2.5 text-sm transition ${
                      destino === op.id
                        ? 'border-brand-gold bg-brand-pink-soft/50'
                        : 'border-brand-gold-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name="destino"
                      className="mt-0.5"
                      checked={destino === op.id}
                      onChange={() => setDestino(op.id)}
                    />
                    <span>
                      <span className="block font-medium">{op.titulo}</span>
                      <span className="block text-xs text-brand-ink/55">
                        {op.ayuda}
                      </span>
                    </span>
                  </label>
                ))}
                {withBleed && (
                  <label className="flex items-center gap-2 pl-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={cropMarks}
                      onChange={(e) => setCropMarks(e.target.checked)}
                    />
                    Marcas de corte
                  </label>
                )}
              </div>

              {warnings.length > 0 && (
                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
                  <p className="mb-1 font-medium">Aviso de resolución:</p>
                  <ul className="list-disc pl-4">
                    {warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => void doExport('pdf')}
                  className="w-full rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
                >
                  {busy === 'pdf' ? 'Generando PDF…' : 'Descargar PDF'}
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => void doExport('png')}
                  className="w-full rounded-lg border border-brand-gold-soft bg-white px-4 py-2 text-sm disabled:opacity-50"
                >
                  {busy === 'png'
                    ? 'Generando PNG…'
                    : 'Descargar PNG (300 DPI)'}
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => void doExport('jpg')}
                  className="w-full rounded-lg border border-brand-gold-soft bg-white px-4 py-2 text-sm disabled:opacity-50"
                >
                  {busy === 'jpg'
                    ? 'Generando JPG…'
                    : 'Descargar JPG (WhatsApp)'}
                </button>
              </div>

              {/* Medidas REALES del archivo que se descarga, no las del diseño. */}
              <p className="text-[11px] text-brand-ink/50">
                El archivo sale de{' '}
                <strong className="font-medium text-brand-ink/70">
                  {inchLabel(fullW)} × {inchLabel(fullH)} pulgadas
                </strong>{' '}
                ({fullW} × {fullH} px a 300 DPI, sRGB)
                {withBleed
                  ? '. Incluye 0.125″ de sangrado por lado: hay que recortarlo a 4×6.'
                  : ', que es justo el tamaño de una foto 4×6.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
