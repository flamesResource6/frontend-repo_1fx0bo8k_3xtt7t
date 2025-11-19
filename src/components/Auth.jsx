import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const dict = {
  en: {
    tabs: { login: 'Login', register: 'Register', verify: 'Verify' },
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    createAccount: 'Create account',
    verificationCode: 'Verification code',
    codePlaceholder: '6-digit code',
    resend: 'Resend code',
    confirm: 'Confirm',
    welcome: 'Welcome back!',
    verifyPrompt: 'Please verify your email to continue. We can resend the code.',
    codeSent: 'Verification code sent. Check your email.',
    registered: 'We sent a code to your email',
    signedInAs: 'Signed in as',
    book: 'Book an appointment',
    myAppts: 'My appointments',
    logout: 'Logout',
    verifying: 'Please wait...',
    emailHint: 'Enter your email and the code we sent to you.',
    lang: 'العربية'
  },
  ar: {
    tabs: { login: 'تسجيل الدخول', register: 'إنشاء حساب', verify: 'تفعيل' },
    name: 'الاسم',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'دخول',
    createAccount: 'إنشاء حساب',
    verificationCode: 'رمز التفعيل',
    codePlaceholder: 'رمز من 6 أرقام',
    resend: 'إعادة إرسال الرمز',
    confirm: 'تأكيد',
    welcome: 'مرحبًا بعودتك!',
    verifyPrompt: 'يرجى تفعيل بريدك الإلكتروني للمتابعة. يمكننا إعادة إرسال الرمز.',
    codeSent: 'تم إرسال رمز التفعيل. تحقق من بريدك.',
    registered: 'أرسلنا رمزًا إلى بريدك الإلكتروني',
    signedInAs: 'مسجّل باسم',
    book: 'احجز موعدًا',
    myAppts: 'مواعيدي',
    logout: 'تسجيل الخروج',
    verifying: 'يرجى الانتظار...',
    emailHint: 'أدخل بريدك الإلكتروني والرمز الذي أرسلناه إليك.',
    lang: 'English'
  }
}

export default function Auth() {
  const [mode, setMode] = useState('login') // login | register | verify
  const [lang, setLang] = useState('en')
  const t = useMemo(() => dict[lang], [lang])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [me, setMe] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('dc_token')
    if (token) {
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(j => j && setMe(j))
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!cooldown) return
    const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('dc_token', data.access_token)
      const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const meJson = await meRes.json()
      setMe(meJson)
      setInfo(t.welcome)
    } catch (err) {
      if (String(err.message).toLowerCase().includes('verify')) {
        setInfo(t.verifyPrompt)
        setMode('verify')
      } else {
        setError(String(err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      setMode('verify')
      setInfo(data.message || t.registered)
    } catch (err) {
      setError(String(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleResend(e) {
    e?.preventDefault()
    if (cooldown > 0) return
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const res = await fetch(`${API}/auth/verify/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 429 && data.detail) {
          const m = String(data.detail)
          const seconds = parseInt(m.match(/(\d+)s/gi)?.[0]?.replace(/\D/g, '') || '60', 10)
          setCooldown(seconds)
        }
        throw new Error(data.detail || 'Failed to send code')
      }
      setInfo(t.codeSent)
      setCooldown(60)
    } catch (err) {
      setError(String(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const res = await fetch(`${API}/auth/verify/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Invalid code')
      localStorage.setItem('dc_token', data.access_token)
      const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const meJson = await meRes.json()
      setMe(meJson)
      setInfo('Your email is verified!')
    } catch (err) {
      setError(String(err.message))
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('dc_token')
    setMe(null)
  }

  function TabButton({ active, children, onClick }) {
    return (
      <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-sm transition ${active? 'bg-white/20 text-white shadow-sm':'bg-white/10 text-slate-200 hover:bg-white/15'}`}>
        {children}
      </button>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <TabButton active={mode==='login'} onClick={() => setMode('login')}>{t.tabs.login}</TabButton>
          <TabButton active={mode==='register'} onClick={() => setMode('register')}>{t.tabs.register}</TabButton>
          <TabButton active={mode==='verify'} onClick={() => setMode('verify')}>{t.tabs.verify}</TabButton>
        </div>
        <button onClick={() => setLang(lang==='en'?'ar':'en')} className="text-xs text-slate-300 hover:text-white underline">
          {t.lang}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 shadow-xl">
        {me ? (
          <div>
            <p className="text-white">{t.signedInAs} {me.name || me.email}</p>
            <div className="mt-4 flex gap-2">
              <a href="/book" className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200">{t.book}</a>
              <a href="/appointments" className="px-3 py-1.5 rounded-lg bg-white/10 text-white">{t.myAppts}</a>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-white/10 text-white">{t.logout}</button>
            </div>
          </div>
        ) : (
          <>
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.email}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.password}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
                </div>
                {error && <p className="text-rose-300 text-sm">{error}</p>}
                {info && <p className="text-emerald-300 text-sm">{info}</p>}
                <button disabled={loading} className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? t.verifying : t.login}</button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.name}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.phone}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.email}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.password}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
                </div>
                {error && <p className="text-rose-300 text-sm">{error}</p>}
                {info && <p className="text-emerald-300 text-sm">{info}</p>}
                <button disabled={loading} className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? t.verifying : t.createAccount}</button>
              </form>
            )}

            {mode === 'verify' && (
              <form onSubmit={handleConfirm} className="space-y-3">
                <p className="text-xs text-slate-400">{t.emailHint}</p>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.email}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">{t.verificationCode}</label>
                  <input dir={lang==='ar'?'rtl':'ltr'} value={code} onChange={e=>setCode(e.target.value)} placeholder={t.codePlaceholder} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white tracking-[0.25em]" required />
                </div>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={handleResend} disabled={cooldown>0} className={`text-xs ${cooldown>0? 'text-slate-500' : 'text-slate-300 hover:text-white'}`}>
                    {t.resend}{cooldown>0? ` (${cooldown}s)` : ''}
                  </button>
                  <button disabled={loading} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">{loading? t.verifying : t.confirm}</button>
                </div>
                {error && <p className="text-rose-300 text-sm">{error}</p>}
                {info && <p className="text-emerald-300 text-sm">{info}</p>}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
