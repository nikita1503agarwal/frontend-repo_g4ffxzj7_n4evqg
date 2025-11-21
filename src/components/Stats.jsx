import { useEffect, useState } from 'react'
import { BarChart2, Users, BedDouble, Snowflake, Wind } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Stats() {
  const [data, setData] = useState(null)

  const load = async () => {
    const res = await fetch(`${API}/summary`)
    const d = await res.json()
    setData(d)
  }

  useEffect(()=>{ load() }, [])

  if (!data) return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-blue-200">Chargement des statistiques...</div>
  )

  const perDay = data.per_day || { capacity:{1:0,2:0,3:0}, assigned:{1:0,2:0,3:0}, remaining:{1:0,2:0,3:0} }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-blue-300" />
        <h2 className="text-white font-semibold">Statistiques</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="flex items-center gap-2 text-blue-300 mb-1"><Users className="w-4 h-4"/> Total participants</div>
          <div className="text-2xl font-semibold">{data.totals.participants}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="flex items-center gap-2 text-blue-300 mb-1"><BedDouble className="w-4 h-4"/> Chambres</div>
          <div className="text-2xl font-semibold">{data.totals.rooms}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="text-blue-300 mb-1">Capacité par jour</div>
          <div className="text-sm">J1: {perDay.capacity[1]} • J2: {perDay.capacity[2]} • J3: {perDay.capacity[3]}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="text-blue-300 mb-1">Places restantes</div>
          <div className="text-sm">J1: {perDay.remaining[1]} • J2: {perDay.remaining[2]} • J3: {perDay.remaining[3]}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="text-blue-300 mb-2">Répartition participants</div>
          <div className="text-sm">Hommes: {data.participants_gender.male} • Femmes: {data.participants_gender.female} • Inconnu: {data.participants_gender.unknown}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-4 text-blue-100">
          <div className="text-blue-300 mb-2">Chambres par refroidissement</div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2"><Wind className="w-4 h-4"/> Ventilées: {data.rooms_by_cooling.ventilated}</div>
            <div className="flex items-center gap-2"><Snowflake className="w-4 h-4"/> Climatisées: {data.rooms_by_cooling.air_conditioned}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-blue-300 text-left">
              <th className="py-2">Chambre</th>
              <th>Jour 1</th>
              <th>Jour 2</th>
              <th>Jour 3</th>
              <th>Capacité</th>
              <th>Type</th>
              <th>Refroidissement</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.occupancy).map(([rid, r]) => (
              <tr key={rid} className="border-t border-slate-700 text-blue-100">
                <td className="py-2">{r.name}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r.capacity}</td>
                <td>{r.type || '-'}</td>
                <td className="flex items-center gap-1">
                  {r.cooling === 'air_conditioned' ? <Snowflake className="w-4 h-4"/> : <Wind className="w-4 h-4"/>}
                  <span className="capitalize">{r.cooling?.replace('_',' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
