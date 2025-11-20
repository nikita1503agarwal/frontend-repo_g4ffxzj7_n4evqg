import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Assignments() {
  const [rooms, setRooms] = useState([])
  const [participants, setParticipants] = useState([])
  const [assignments, setAssignments] = useState([])

  const [form, setForm] = useState({ participant_id: '', room_id: '', days: {1:false,2:false,3:false} })
  const [error, setError] = useState('')

  const loadAll = async () => {
    const [r, p, a] = await Promise.all([
      fetch(`${API}/rooms`).then(r=>r.json()),
      fetch(`${API}/participants`).then(r=>r.json()),
      fetch(`${API}/assignments`).then(r=>r.json())
    ])
    setRooms(r); setParticipants(p); setAssignments(a)
  }

  useEffect(() => { loadAll() }, [])

  const createAssignment = async (e) => {
    e.preventDefault()
    setError('')
    const stay_days = Object.entries(form.days).filter(([k,v])=>v).map(([k])=>Number(k))
    if (!form.participant_id || !form.room_id || stay_days.length===0) {
      setError('Veuillez choisir un participant, une chambre et au moins un jour.')
      return
    }
    const res = await fetch(`${API}/assignments`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ participant_id: form.participant_id, room_id: form.room_id, stay_days })
    })
    if (!res.ok) {
      const msg = await res.json().catch(()=>({detail:'Erreur'}))
      setError(msg.detail || 'Erreur lors de la création')
    } else {
      setForm({ participant_id: '', room_id: '', days: {1:false,2:false,3:false} })
      loadAll()
    }
  }

  const occupancy = useMemo(() => {
    const occ = {}
    rooms.forEach(r=>{ occ[r.id] = {1:0,2:0,3:0, capacity:r.capacity, name:r.name} })
    assignments.forEach(a=>{
      a.stay_days.forEach(d=>{ if (occ[a.room_id]) occ[a.room_id][d] += 1 })
    })
    return occ
  }, [rooms, assignments])

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-blue-300" />
        <h2 className="text-white font-semibold">Attributions</h2>
      </div>

      <form onSubmit={createAssignment} className="grid md:grid-cols-6 gap-3 mb-3">
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white md:col-span-2" value={form.participant_id} onChange={e=>setForm({...form,participant_id:e.target.value})}>
          <option value="">Choisir un participant</option>
          {participants.map(p=> <option key={p.id} value={p.id}>{p.full_name}</option>)}
        </select>
        <select className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white md:col-span-2" value={form.room_id} onChange={e=>setForm({...form,room_id:e.target.value})}>
          <option value="">Choisir une chambre</option>
          {rooms.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="flex items-center gap-4 md:col-span-2">
          {[1,2,3].map(d=> (
            <label key={d} className={`flex items-center gap-2 px-3 py-2 rounded border ${form.days[d] ? 'bg-blue-600/30 border-blue-400' : 'bg-slate-900/60 border-slate-700'} text-white cursor-pointer`}>
              <input type="checkbox" className="hidden" checked={form.days[d]} onChange={e=>setForm({...form, days:{...form.days,[d]:e.target.checked}})} />
              <span>Jour {d}</span>
              {form.days[d] && <Check className="w-4 h-4 text-blue-300" />}
            </label>
          ))}
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Attribuer</button>
      </form>
      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-blue-300 text-left">
              <th className="py-2">Chambre</th>
              <th>Jour 1</th>
              <th>Jour 2</th>
              <th>Jour 3</th>
              <th>Capacité</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(occupancy).map((r, idx) => (
              <tr key={idx} className="border-t border-slate-700 text-blue-100">
                <td className="py-2">{r.name}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        {assignments.map(a=>{
          const p = participants.find(x=>x.id===a.participant_id)
          const r = rooms.find(x=>x.id===a.room_id)
          return (
            <div key={a.id} className="bg-slate-900/40 border border-slate-700 rounded p-3 text-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p?.full_name || '—'}</p>
                  <p className="text-xs text-blue-300">{r?.name || '—'}</p>
                </div>
                <div className="text-xs">Jours: {a.stay_days.join(', ')}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
