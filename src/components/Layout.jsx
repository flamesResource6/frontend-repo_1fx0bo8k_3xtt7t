import Navbar from './Navbar'
import { I18nProvider, useI18n } from './I18n'

function Shell({ children }){
  const { t, dir } = useI18n()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100" dir={dir}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        {children}
      </main>
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <span>© {new Date().getFullYear()} DermaCare+. {t.footer.rights}</span>
          <div className="flex gap-4">
            <a href="#">{t.footer.privacy}</a>
            <a href="#">{t.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Layout({ children }){
  return (
    <I18nProvider>
      <Shell>{children}</Shell>
    </I18nProvider>
  )
}
