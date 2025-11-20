import { useEffect, useState } from 'react'
import { Users, Plus } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Participants() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', gender: 'male', parish: '' })

  const fetchData = async () => {
    const res = await fetch(`${API}/participants`)
    const data = await res.json()
    setList(data)
  }

  useEffect(() => { fetchData() }, [])

  const createItem = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    await fetch(`${API}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setForm({ full_name: '', email: '', phone: '', gender: 'male', parish: '' })
    fetchData()
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-300" />
        <h2 className="text-white font-semibold">Participants</h2>
      </div>

      <form onSubmit={createItem} className="grid md:grid-cols-6 gap-3 mb-4">
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Nom complet" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} required />
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Téléphone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Paroisse / Communauté" value={form.parish} onChange={e=>setForm({...form,parish:e.target.value})} />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-3">
        {list.map(p => (
          <div key={p.id} className="bg-slate-900/40 border border-slate-700 rounded p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">{p.full_name}</h3>
              {p.gender && <span className="text-xs text-blue-300">{p.gender}</span>}
            </div>
            <p className="text-xs text-blue-200/80">{p.email || '—'} • {p.phone || '—'}</p>
            {p.parish && <p className="text-xs text-blue-300 mt-1">{p.parish}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
