import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [me, setMe] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`
      const body = mode === 'login' ? { email, password } : { email, password, name, phone }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      localStorage.setItem('dc_token', data.access_token)
      const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const meJson = await meRes.json()
      setMe(meJson)
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
        <form onSubmit={submit} className="space-y-3">
          {mode==='register' && (
            <>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Phone</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white" required />
          </div>
          {error && <p className="text-rose-300 text-sm">{error}</p>}
          <button disabled={loading} className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">{loading? 'Please wait...' : (mode==='login'?'Login':'Create account')}</button>
        </form>
      )}
    </div>
  )
}
