import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Auth from './components/Auth'
import { I18nProvider, useI18n } from './components/I18n'

function Content() {
  const { t, dir } = useI18n()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100" dir={dir}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        <Hero />
        <Services />
        <Auth />
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

function App() {
  return (
    <I18nProvider>
      <Content />
    </I18nProvider>
  )
}

export default App
