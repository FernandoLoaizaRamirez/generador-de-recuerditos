import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, saveProfile } from '../lib/db'

/**
 * Perfil del negocio (RF-23): nombre y teléfono que se autocompletan en los
 * campos de marca de cada recuerdo nuevo.
 */
export function ProfilePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getProfile().then((p) => {
      if (cancelled || !p) return
      setName(p.name)
      setPhone(p.phone)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const onSave = async () => {
    await saveProfile({ name: name.trim(), phone: phone.trim() })
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-md">
      <Link to="/" className="text-sm text-brand-ink/60 hover:text-brand-ink">
        ← Mis proyectos
      </Link>
      <h2 className="mb-1 mt-2 text-lg font-medium">Perfil del negocio</h2>
      <p className="mb-6 text-sm text-brand-ink/60">
        Estos datos se rellenan solos en cada recuerdo nuevo.
      </p>

      <div className="space-y-4 rounded-xl border border-brand-gold-soft bg-white p-5">
        <label className="block">
          <span className="mb-1 block text-xs text-brand-ink/60">
            Nombre del negocio
          </span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            placeholder='Videofilmaciones "Yesenia"'
            className="w-full rounded-md border border-brand-gold-soft bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-brand-ink/60">Teléfono</span>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setSaved(false)
            }}
            placeholder="Cel. 6672 21 62 83"
            className="w-full rounded-md border border-brand-gold-soft bg-white px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => void onSave()}
          className="rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
        >
          Guardar perfil
        </button>
        {saved && <p className="text-xs text-green-600">Perfil guardado ✓</p>}
      </div>
    </div>
  )
}
