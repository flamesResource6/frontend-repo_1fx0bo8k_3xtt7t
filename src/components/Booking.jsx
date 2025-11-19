import { useEffect, useMemo, useState } from 'react'
import { useI18n } from './I18n'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Booking() {
  const { lang, dir } = useI18n()
  const t = useMemo(() => dict[lang], [lang])
  const [services, setServices] = useState([])
  const [selected, setSelected] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/services`).then(r=>r.json()).then(setServices).catch(()=>setServices([]))
  }, [])

  async function createAppointment(e){
    e.preventDefault()
    setInfo(''); setError(''); setLoading(true)
    try {
      const token = localStorage.getItem('dc_token')
      if(!token) throw new Error(t.loginRequired)
      if(!selected) throw new Error(t.pickService)
      const res = await fetch(`${API}/appointments`,{
        method:'POST',
        headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
        body: JSON.stringify({ service_id: selected._id || selected.id || selected.service_id, date, time, mode:'in_clinic', notes })
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || t.failed)
      setInfo(t.success)
      setSelected(null); setDate(''); setTime(''); setNotes('')
    } catch(err){
      setError(String(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-4xl mx-auto" dir={dir}>
      <h2 className="text-2xl text-white font-semibold mb-4">{t.title}</h2>
      <p className="text-slate-300 text-sm mb-6">{t.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          {services.map(s => (
            <button key={s._id || s.name}
              onClick={() => setSelected(s)}
              className={`w-full text-left p-4 rounded-xl border ${selected===s? 'border-emerald-400 bg-emerald-400/10':'border-white/10 bg-white/5 hover:bg-white/10'} transition`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{s.name}</span>
                <span className="text-sm text-emerald-300 bg-emerald-300/10 px-2 py-0.5 rounded">{t.currency}{s.price}</span>
              </div>
              <p className="text-slate-300 text-sm mt-1">{s.description}</p>
            </button>
          ))}
          {services.length===0 && (
            <p className="text-slate-400 text-sm">{t.noServices}</p>
          )}
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <h3 className="text-white font-medium mb-3">{t.details}</h3>
          <form onSubmit={createAppointment} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">{t.selectedService}</label>
              <input disabled value={selected? selected.name : ''} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t.date}</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t.time}</label>
                <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">{t.notes}</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full min-h-[90px] bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" placeholder={t.notesPh} />
            </div>
            {error && <p className="text-rose-300 text-sm">{error}</p>}
            {info && <p className="text-emerald-300 text-sm">{info}</p>}
            <button disabled={loading} className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? t.saving : t.bookNow}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

const dict = {
  en: {
    title: 'Book an appointment',
    subtitle: 'Choose a service, pick a date and time, and confirm your appointment.',
    currency: '$',
    noServices: 'No services found yet.',
    details: 'Appointment details',
    selectedService: 'Selected service',
    date: 'Date',
    time: 'Time',
    notes: 'Notes (optional)',
    notesPh: 'Any preferences or notes for the doctor',
    saving: 'Booking...',
    bookNow: 'Confirm booking',
    loginRequired: 'Please login to book an appointment.',
    pickService: 'Please select a service.',
    failed: 'Failed to create appointment',
    success: 'Appointment created successfully.'
  },
  ar: {
    title: 'احجز موعدًا',
    subtitle: 'اختر الخدمة، حدّد التاريخ والوقت، ثم أكّد الحجز.',
    currency: '$',
    noServices: 'لا توجد خدمات بعد.',
    details: 'تفاصيل الموعد',
    selectedService: 'الخدمة المختارة',
    date: 'التاريخ',
    time: 'الوقت',
    notes: 'ملاحظات (اختياري)',
    notesPh: 'أي تفضيلات أو ملاحظات للطبيب',
    saving: 'جارٍ الحجز...',
    bookNow: 'تأكيد الحجز',
    loginRequired: 'يرجى تسجيل الدخول لحجز موعد.',
    pickService: 'يرجى اختيار خدمة.',
    failed: 'فشل إنشاء الموعد',
    success: 'تم إنشاء الموعد بنجاح.'
  }
}
