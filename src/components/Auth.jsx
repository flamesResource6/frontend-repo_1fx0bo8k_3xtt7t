import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth() {
  const [mode, setMode] = useState('login') // login | register | verify
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [me, setMe] = useState(null)

  useEffect(() => {
    // Try restore session
    const token = localStorage.getItem('dc_token')
    if (token) {
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(j => j && setMe(j))
        .catch(() => {})
    }
  }, [])

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
      setInfo('Welcome back!')
    } catch (err) {
      // If not verified, guide to verify
      if (String(err.message).toLowerCase().includes('verify')) {
        setInfo('Please verify your email to continue. We can resend the code.')
        setMode('verify')
      } else {
        setError(err.message)
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
      setInfo(data.message || 'We sent a code to your email')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend(e) {
    e?.preventDefault()
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
      if (!res.ok) throw new Error(data.detail || 'Failed to send code')
      setInfo('Verification code sent. Check your email.')
    } catch (err) {
      setError(err.message)
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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('dc_token')
    setMe(null)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-1.5 rounded-lg text-sm ${mode==='login'?'bg-white/20 text-white':'bg-white/10 text-slate-200'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`px-3 py-1.5 rounded-lg text-sm ${mode==='register'?'bg-white/20 text-white':'bg-white/10 text-slate-200'}`}>Register</button>
        <button onClick={() => setMode('verify')} className={`px-3 py-1.5 rounded-lg text-sm ${mode==='verify'?'bg-white/20 text-white':'bg-white/10 text-slate-200'}`}>Verify</button>
      </div>

      {me ? (
        <div>
          <p className="text-white">Signed in as {me.name || me.email}</p>
          <div className="mt-4 flex gap-2">
            <a href="/book" className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200">Book an appointment</a>
            <a href="/appointments" className="px-3 py-1.5 rounded-lg bg-white/10 text-white">My appointments</a>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-white/10 text-white">Logout</button>
          </div>
        </div>
      ) : (
        <>
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              {error && <p className="text-rose-300 text-sm">{error}</p>}
              {info && <p className="text-emerald-300 text-sm">{info}</p>}
              <button disabled={loading} className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? 'Please wait...' : 'Login'}</button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Phone</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              {error && <p className="text-rose-300 text-sm">{error}</p>}
              {info && <p className="text-emerald-300 text-sm">{info}</p>}
              <button disabled={loading} className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? 'Please wait...' : 'Create account'}</button>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleConfirm} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Verification code</label>
                <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
              </div>
              <div className="flex items-center justify-between">
                <button type="button" onClick={handleResend} className="text-xs text-slate-300 hover:text-white">Resend code</button>
                <button disabled={loading} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">{loading? 'Please wait...' : 'Confirm'}</button>
              </div>
              {error && <p className="text-rose-300 text-sm">{error}</p>}
              {info && <p className="text-emerald-300 text-sm">{info}</p>}
            </form>
          )}
        </>
      )}
    </div>
  )
}
