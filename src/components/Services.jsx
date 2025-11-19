import { useEffect, useState } from 'react'
import { useI18n } from './I18n'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Services() {
  const [services, setServices] = useState([])
  const { t, dir } = useI18n()

  useEffect(() => {
    fetch(`${API}/services`).then(r => r.json()).then(setServices).catch(() => setServices([]))
  }, [])

  return (
    <section className="mt-10" dir={dir}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t.services.heading}</h2>
        <a href="#" className="text-sm text-slate-300 hover:text-white">{t.services.viewAll}</a>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.length === 0 && (
          [
            {name:'Botox', description:'Smooth fine lines', price:150},
            {name:'Fillers', description:'Restore youthful volume', price:220},
            {name:'Laser Hair Removal', description:'Silky smooth skin', price:120},
          ].map((s, i) => (
            <Card key={i} item={s} symbol={t.services.priceSymbol} bookLabel={t.services.book} />
          ))
        )}
        {services.map((s) => (
          <Card key={s._id} item={s} symbol={t.services.priceSymbol} bookLabel={t.services.book} />
        ))}
      </div>
    </section>
  )
}

function Card({ item, symbol, bookLabel }) {
  return (
    <div className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">{item.name}</h3>
        <span className="text-sm text-emerald-300 bg-emerald-300/10 px-2 py-0.5 rounded">{symbol}{item.price}</span>
      </div>
      <p className="mt-2 text-slate-300 text-sm">{item.description}</p>
      <button className="mt-4 text-sm text-white/90 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">{bookLabel}</button>
    </div>
  )
}
