import { useEffect, useMemo, useState } from 'react'
import { useI18n } from './I18n'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Appointments(){
  const { lang, dir } = useI18n()
  const t = useMemo(() => dict[lang], [lang])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('dc_token')
    if(!token){ setError(t.loginRequired); setLoading(false); return }
    fetch(`${API}/appointments/my`, { headers: { Authorization: `Bearer ${token}` }})
      .then(async r => { const j = await r.json(); if(!r.ok) throw new Error(j.detail || 'error'); return j })
      .then(j => setItems(j))
      .catch(err => setError(String(err.message)))
      .finally(() => setLoading(false))
  }, [lang])

  return (
    <section className="max-w-4xl mx-auto" dir={dir}>
      <h2 className="text-2xl text-white font-semibold mb-4">{t.title}</h2>
      {loading && <p className="text-slate-300 text-sm">{t.loading}</p>}
      {error && <p className="text-rose-300 text-sm">{error}</p>}
      <div className="space-y-3">
        {items.map(a => (
          <div key={a._id} className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium">{a.service_id}</div>
              <div className="text-sm text-emerald-300">{a.status || 'pending'}</div>
            </div>
            <div className="text-slate-300 text-sm mt-1">{a.date} • {a.time} • {a.mode}</div>
            {a.notes && <p className="text-slate-400 text-sm mt-1">{a.notes}</p>}
          </div>
        ))}
        {!loading && items.length===0 && !error && (
          <p className="text-slate-400 text-sm">{t.empty}</p>
        )}
      </div>
    </section>
  )
}

const dict = {
  en: {
    title: 'My appointments',
    loading: 'Loading...',
    empty: 'No appointments yet.',
    loginRequired: 'Please login to view your appointments.'
  },
  ar: {
    title: 'مواعيدي',
    loading: 'جارٍ التحميل...',
    empty: 'لا توجد مواعيد بعد.',
    loginRequired: 'يرجى تسجيل الدخول لعرض مواعيدك.'
  }
}
