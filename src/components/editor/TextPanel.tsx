import { useEditorStore } from '../../store/editorStore'

/** Panel de edición de los textos de la plantilla. */
export function TextPanel() {
  const template = useEditorStore((s) => s.template)
  const project = useEditorStore((s) => s.project)
  const setText = useEditorStore((s) => s.setText)
  const selectText = useEditorStore((s) => s.selectText)

  if (!template || !project) return null

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-brand-ink/70">
        TEXTOS
      </h3>
      <div className="space-y-3">
        {template.textFields.map((field) => {
          const value = project.texts[field.id]?.value ?? ''
          const multiline = field.maxLines > 1
          return (
            <label key={field.id} className="block">
              <span className="mb-1 block text-xs text-brand-ink/60">
                {field.placeholder}
              </span>
              {multiline ? (
                <textarea
                  value={value}
                  rows={2}
                  onFocus={() => selectText(field.id)}
                  onChange={(e) => setText(field.id, e.target.value)}
                  className="w-full resize-none rounded-md border border-brand-gold-soft bg-white px-2 py-1.5 text-sm"
                />
              ) : (
                <input
                  value={value}
                  onFocus={() => selectText(field.id)}
                  onChange={(e) => setText(field.id, e.target.value)}
                  className="w-full rounded-md border border-brand-gold-soft bg-white px-2 py-1.5 text-sm"
                />
              )}
            </label>
          )
        })}
      </div>
    </section>
  )
}
