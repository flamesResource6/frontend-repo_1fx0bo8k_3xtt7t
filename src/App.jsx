import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Auth from './components/Auth'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        <Hero />
        <Services />
        <Auth />
      </main>
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <span>© {new Date().getFullYear()} DermaCare+. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
