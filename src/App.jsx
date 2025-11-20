import Header from './components/Header'
import Rooms from './components/Rooms'
import Participants from './components/Participants'
import Assignments from './components/Assignments'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 max-w-6xl mx-auto">
        <Header />
        <div className="grid gap-6">
          <Rooms />
          <Participants />
          <Assignments />
        </div>
      </div>
    </div>
  )
}

export default App