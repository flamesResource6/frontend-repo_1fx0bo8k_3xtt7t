import { useEffect, useMemo, useState } from 'react'
import { useI18n } from './I18n'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Profile(){
  const { lang, dir } = useI18n()
  const t = useMemo(() => dict[lang], [lang])
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('dc_token')
    if(!token){ setError(t.loginRequired); return }
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then(async r => { const j = await r.json(); if(!r.ok) throw new Error(j.detail || 'error'); return j })
      .then(setMe)
      .catch(err => setError(String(err.message)))
  }, [lang])

  return (
    <section className="max-w-3xl mx-auto" dir={dir}>
      <h2 className="text-2xl text-white font-semibold mb-4">{t.title}</h2>
      {error && <p className="text-rose-300 text-sm">{error}</p>}
      {me && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t.name} value={me.name || '-'} />
            <Field label={t.email} value={me.email} />
            <Field label={t.phone} value={me.phone || '-'} />
            <Field label={t.role} value={me.role || 'user'} />
          </div>
        </div>
      )}
    </section>
  )
}

function Field({ label, value }){
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-white">{value}</div>
    </div>
  )
}

const dict = {
  en: { title: 'Profile', name: 'Name', email: 'Email', phone: 'Phone', role: 'Role', loginRequired: 'Please login to view your profile.' },
  ar: { title: 'الملف الشخصي', name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', role: 'الدور', loginRequired: 'يرجى تسجيل الدخول لعرض ملفك.' }
}
