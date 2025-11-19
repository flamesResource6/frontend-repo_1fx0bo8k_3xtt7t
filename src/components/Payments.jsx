import { useEffect, useMemo, useState } from 'react'
import { useI18n } from './I18n'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Payments(){
  const { lang, dir } = useI18n()
  const t = useMemo(() => dict[lang], [lang])
  const [amount, setAmount] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  async function initPayment(e){
    e.preventDefault()
    setInfo(''); setError(''); setClientSecret('')
    try {
      const token = localStorage.getItem('dc_token')
      if(!token) throw new Error(t.loginRequired)
      const res = await fetch(`${API}/payments/init`, {
        method:'POST',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ appointment_id: appointmentId, amount: parseFloat(amount) })
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || t.failed)
      setClientSecret(data.client_secret)
      setInfo(t.created)
    } catch(err){
      setError(String(err.message))
    }
  }

  return (
    <section className="max-w-4xl mx-auto" dir={dir}>
      <h2 className="text-2xl text-white font-semibold mb-4">{t.title}</h2>
      <p className="text-slate-300 text-sm mb-6">{t.subtitle}</p>
      <form onSubmit={initPayment} className="space-y-3 p-4 rounded-xl border border-white/10 bg-white/5">
        <div>
          <label className="block text-sm text-slate-300 mb-1">{t.appointmentId}</label>
          <input value={appointmentId} onChange={e=>setAppointmentId(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="appt_id" required />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">{t.amount}</label>
          <input type="number" min="1" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="100.00" required />
        </div>
        {error && <p className="text-rose-300 text-sm">{error}</p>}
        {info && <p className="text-emerald-300 text-sm">{info}</p>}
        {clientSecret && (
          <p className="text-xs text-slate-400 break-all">Client secret: {clientSecret}</p>
        )}
        <button className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{t.payNow}</button>
      </form>
    </section>
  )
}

const dict = {
  en: {
    title: 'Payments',
    subtitle: 'Initialize a payment for an existing appointment.',
    appointmentId: 'Appointment ID',
    amount: 'Amount',
    payNow: 'Create payment intent',
    created: 'Payment intent created. Use client secret to confirm via Stripe.',
    failed: 'Failed to create payment',
    loginRequired: 'Please login to create a payment.'
  },
  ar: {
    title: 'المدفوعات',
    subtitle: 'ابدأ عملية الدفع لموعد موجود.',
    appointmentId: 'معرّف الموعد',
    amount: 'المبلغ',
    payNow: 'إنشاء نية دفع',
    created: 'تم إنشاء نية الدفع. استخدم client secret للإتمام عبر سترايب.',
    failed: 'فشل إنشاء الدفع',
    loginRequired: 'يرجى تسجيل الدخول لإنشاء عملية دفع.'
  }
}
