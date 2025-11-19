import Spline from '@splinetool/react-spline';
import { useI18n } from './I18n'

export default function Hero() {
  const { t, dir } = useI18n()
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10" dir={dir}>
      <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
      <div className="absolute inset-0 flex items-end p-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{t.hero.title}</h1>
          <p className="mt-3 text-slate-200/90">{t.hero.subtitle}</p>
        </div>
      </div>
    </section>
  )
}
