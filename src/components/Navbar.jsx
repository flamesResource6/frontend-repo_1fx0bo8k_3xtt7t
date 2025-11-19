import { Menu, Search, User, Calendar, CreditCard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from './I18n'

export default function Navbar() {
  const { t, lang, setLang, dir } = useI18n()
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/40 border-b border-white/10" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-white/5" onClick={() => navigate('/') } aria-label="Menu"><Menu className="w-5 h-5 text-white" /></button>
          <Link to="/" className="text-white font-semibold">DermaCare+</Link>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-72">
          <Search className="w-4 h-4 text-slate-200" />
          <input placeholder={t.nav.searchPlaceholder} className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-400 w-full" dir={dir} />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/book" className="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20">{t.nav.bookNow}</Link>
          <Link to="/appointments" className="p-2 rounded-lg hover:bg-white/5" title={t.nav.appointments}><Calendar className="w-5 h-5 text-white" /></Link>
          <Link to="/payments" className="p-2 rounded-lg hover:bg-white/5" title={t.nav.payments}><CreditCard className="w-5 h-5 text-white" /></Link>
          <Link to="/profile" className="p-2 rounded-lg hover:bg-white/5" title={t.nav.account}><User className="w-5 h-5 text-white" /></Link>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-2 py-1 text-xs rounded-md bg-white/10 text-slate-200 hover:bg-white/20">
            {t.nav.lang}
          </button>
        </div>
      </div>
    </header>
  )
}
