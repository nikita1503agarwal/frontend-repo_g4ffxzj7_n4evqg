import { useEffect, useState } from 'react'
import { BedDouble, Plus, Wind, Snowflake } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ name: '', capacity: 1, gender: 'mixed', type: 'dorm', cooling: 'ventilated', amenities: '' })
  const [loading, setLoading] = useState(false)

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
          </div>
        ))}
      </div>
    </div>
  )
}
