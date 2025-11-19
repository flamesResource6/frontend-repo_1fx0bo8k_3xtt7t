import { Menu, Search, User, Calendar, CreditCard } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-white/5"><Menu className="w-5 h-5 text-white" /></button>
          <span className="text-white font-semibold">DermaCare+</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-200" />
          <input placeholder="Search services" className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20">Book Now</button>
          <button className="p-2 rounded-lg hover:bg-white/5"><Calendar className="w-5 h-5 text-white" /></button>
          <button className="p-2 rounded-lg hover:bg-white/5"><CreditCard className="w-5 h-5 text-white" /></button>
          <button className="p-2 rounded-lg hover:bg-white/5"><User className="w-5 h-5 text-white" /></button>
        </div>
      </div>
    </header>
  )
}
