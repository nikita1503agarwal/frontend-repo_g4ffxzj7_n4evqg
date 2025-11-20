import { Home } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
          <Home className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Gestion Hébergements</h1>
          <p className="text-sm text-blue-200/70">Retraite de prières - 3 jours</p>
        </div>
      </div>
      <a href="/test" className="text-sm text-blue-200 hover:text-white transition">Tester la connexion</a>
    </div>
  )
}
