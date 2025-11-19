import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10">
      <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
      <div className="absolute inset-0 flex items-end p-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">DermaCare+</h1>
          <p className="mt-3 text-slate-200/90">Luxury cosmetic and aesthetic medicine at your fingertips. Browse services, book expert doctors, and manage your care with elegance.</p>
        </div>
      </div>
    </section>
  )
}
