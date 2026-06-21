import { useEditorStore } from '../../store/editorStore'

const slotLabel = (id: string, index: number) =>
  id.includes('retrato') ? 'Retrato' : `Foto ${index + 1}`

/** Panel de control de los huecos de foto: subir, zoom, rotar, quitar. */
export function SlotPanel({
  onRequestUpload,
}: {
  onRequestUpload: (slotId: string) => void
}) {
  const template = useEditorStore((s) => s.template)
  const project = useEditorStore((s) => s.project)
  const selectedSlotId = useEditorStore((s) => s.selectedSlotId)
  const selectSlot = useEditorStore((s) => s.selectSlot)
  const updateSlotTransform = useEditorStore((s) => s.updateSlotTransform)
  const removeSlotImage = useEditorStore((s) => s.removeSlotImage)

  if (!template || !project) return null

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-brand-ink/70">
        FOTOS
      </h3>
      <ul className="space-y-3">
        {template.photoSlots.map((slot, i) => {
          const st = project.slots[slot.id]
          const has = !!st.imageBlobId
          const selected = selectedSlotId === slot.id
          return (
            <li
              key={slot.id}
              onClick={() => selectSlot(slot.id)}
              className={`rounded-lg border bg-white p-3 transition ${
                selected
                  ? 'border-blue-400 ring-2 ring-blue-200'
                  : 'border-brand-gold-soft'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {slotLabel(slot.id, i)}
                </span>
                <span className="text-xs text-brand-ink/40">
                  {has ? 'Con foto' : 'Vacío'}
                </span>
              </div>

              {has ? (
                <div className="space-y-2">
                  <label className="block text-xs text-brand-ink/60">
                    Zoom
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.05}
                      value={st.transform.scale}
                      onChange={(e) =>
                        updateSlotTransform(slot.id, {
                          scale: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        updateSlotTransform(slot.id, {
                          rotation: (st.transform.rotation + 90) % 360,
                          offsetX: 0,
                          offsetY: 0,
                        })
                      }
                      className="rounded-md border border-brand-gold-soft px-2 py-1"
                    >
                      Girar 90°
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSlotTransform(slot.id, {
                          scale: 1,
                          offsetX: 0,
                          offsetY: 0,
                          rotation: 0,
                        })
                      }
                      className="rounded-md border border-brand-gold-soft px-2 py-1"
                    >
                      Centrar
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestUpload(slot.id)}
                      className="rounded-md border border-brand-gold-soft px-2 py-1"
                    >
                      Reemplazar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlotImage(slot.id)}
                      className="rounded-md border border-red-200 px-2 py-1 text-red-600"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestUpload(slot.id)}
                  className="w-full rounded-md bg-brand-gold/90 px-3 py-2 text-sm font-medium text-white"
                >
                  Subir foto
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
