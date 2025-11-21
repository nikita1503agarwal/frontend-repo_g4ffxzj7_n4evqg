import { useEffect, useState } from 'react'
import { BedDouble, Plus, Wind, Snowflake, Pencil, Trash2, Save, X } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ name: '', capacity: 1, gender: 'mixed', type: 'dorm', cooling: 'ventilated', amenities: '' })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', capacity: 1, gender: 'mixed', type: 'dorm', cooling: 'ventilated', amenities: [] })

  const fetchRooms = async () => {
    const res = await fetch(`${API}/rooms`)
    const data = await res.json()
    setRooms(data)
  }

  useEffect(() => { fetchRooms() }, [])

  const createRoom = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      name: form.name,
      capacity: Number(form.capacity),
      gender: form.gender,
      type: form.type,
      cooling: form.cooling,
      amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : []
    }
    await fetch(`${API}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setForm({ name: '', capacity: 1, gender: 'mixed', type: 'dorm', cooling: 'ventilated', amenities: '' })
    setLoading(false)
    fetchRooms()
  }

  const startEdit = (r) => {
    setEditingId(r.id)
    setEditForm({
      name: r.name,
      capacity: r.capacity,
      gender: r.gender,
      type: r.type,
      cooling: r.cooling || 'ventilated',
      amenities: r.amenities || []
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id) => {
    const payload = {
      name: editForm.name,
      capacity: Number(editForm.capacity),
      gender: editForm.gender,
      type: editForm.type,
      cooling: editForm.cooling,
      amenities: Array.isArray(editForm.amenities) ? editForm.amenities : String(editForm.amenities).split(',').map(s=>s.trim()).filter(Boolean)
    }
    const res = await fetch(`${API}/rooms/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if (res.ok) {
      setEditingId(null)
      fetchRooms()
    }
  }

  const removeRoom = async (id) => {
    if (!confirm('Supprimer cette chambre ?')) return
    const res = await fetch(`${API}/rooms/${id}`, { method:'DELETE' })
    if (res.ok) fetchRooms()
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BedDouble className="w-5 h-5 text-blue-300" />
        <h2 className="text-white font-semibold">Chambres</h2>
      </div>

      <form onSubmit={createRoom} className="grid md:grid-cols-6 gap-3 mb-4">
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input type="number" min="1" className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Capacité" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} required />
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
          <option value="mixed">Mixte</option>
          <option value="male">Hommes</option>
          <option value="female">Femmes</option>
        </select>
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="dorm">Dortoir</option>
          <option value="double">Double</option>
          <option value="private">Privée</option>
        </select>
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={form.cooling} onChange={e=>setForm({...form,cooling:e.target.value})}>
          <option value="ventilated">Ventilée</option>
          <option value="air_conditioned">Climatisée</option>
        </select>
        <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white md:col-span-2" placeholder="Équipements (séparés par des virgules)" value={form.amenities} onChange={e=>setForm({...form,amenities:e.target.value})} />
        <button disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-3">
        {rooms.map(r => (
          <div key={r.id} className="bg-slate-900/40 border border-slate-700 rounded p-3">
            {editingId === r.id ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="1" className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.capacity} onChange={e=>setEditForm({...editForm,capacity:e.target.value})} />
                  <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.gender} onChange={e=>setEditForm({...editForm,gender:e.target.value})}>
                    <option value="mixed">Mixte</option>
                    <option value="male">Hommes</option>
                    <option value="female">Femmes</option>
                  </select>
                  <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.type} onChange={e=>setEditForm({...editForm,type:e.target.value})}>
                    <option value="dorm">Dortoir</option>
                    <option value="double">Double</option>
                    <option value="private">Privée</option>
                  </select>
                  <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.cooling} onChange={e=>setEditForm({...editForm,cooling:e.target.value})}>
                    <option value="ventilated">Ventilée</option>
                    <option value="air_conditioned">Climatisée</option>
                  </select>
                </div>
                <input className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" value={Array.isArray(editForm.amenities)? editForm.amenities.join(', ') : editForm.amenities} onChange={e=>setEditForm({...editForm,amenities:e.target.value})} />
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={()=>saveEdit(r.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"><Save className="w-4 h-4"/> Enregistrer</button>
                  <button onClick={cancelEdit} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-2"><X className="w-4 h-4"/> Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{r.name}</h3>
                  <span className="text-xs text-blue-300">Capacité: {r.capacity}</span>
                </div>
                <p className="text-xs text-blue-200/70">Type: {r.type} • {r.gender}</p>
                <div className="flex items-center gap-2 text-xs text-blue-300 mt-1">
                  {r.cooling === 'air_conditioned' ? (
                    <><Snowflake className="w-4 h-4" /> Climatisée</>
                  ) : (
                    <><Wind className="w-4 h-4" /> Ventilée</>
                  )}
                </div>
                {r.amenities && r.amenities.length > 0 && (
                  <p className="text-xs text-blue-300 mt-1">{r.amenities.join(', ')}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={()=>startEdit(r)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-2"><Pencil className="w-4 h-4"/> Modifier</button>
                  <button onClick={()=>removeRoom(r.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"><Trash2 className="w-4 h-4"/> Supprimer</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
