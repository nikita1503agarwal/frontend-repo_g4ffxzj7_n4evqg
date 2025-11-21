import { useEffect, useState } from 'react'
import { Users, Plus, Pencil, Trash2, Save, X } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Participants() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', gender: 'male', parish: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ full_name: '', email: '', phone: '', gender: 'male', parish: '' })

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

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditForm({ full_name: p.full_name || '', email: p.email || '', phone: p.phone || '', gender: p.gender || 'male', parish: p.parish || '' })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (id) => {
    const res = await fetch(`${API}/participants/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(editForm) })
    if (res.ok) {
      setEditingId(null)
      fetchData()
    }
  }

  const removeItem = async (id) => {
    if (!confirm('Supprimer ce participant ?')) return
    const res = await fetch(`${API}/participants/${id}`, { method:'DELETE' })
    if (res.ok) fetchData()
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
            {editingId === p.id ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.full_name} onChange={e=>setEditForm({...editForm,full_name:e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Email" value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})} />
                  <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Téléphone" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})} />
                  <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.gender} onChange={e=>setEditForm({...editForm,gender:e.target.value})}>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                  <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Paroisse / Communauté" value={editForm.parish} onChange={e=>setEditForm({...editForm,parish:e.target.value})} />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={()=>saveEdit(p.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"><Save className="w-4 h-4"/> Enregistrer</button>
                  <button onClick={cancelEdit} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-2"><X className="w-4 h-4"/> Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{p.full_name}</h3>
                  {p.gender && <span className="text-xs text-blue-300">{p.gender}</span>}
                </div>
                <p className="text-xs text-blue-200/80">{p.email || '—'} • {p.phone || '—'}</p>
                {p.parish && <p className="text-xs text-blue-300 mt-1">{p.parish}</p>}
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={()=>startEdit(p)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-2"><Pencil className="w-4 h-4"/> Modifier</button>
                  <button onClick={()=>removeItem(p.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"><Trash2 className="w-4 h-4"/> Supprimer</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
