import { MonitorCog } from 'lucide-react'
import { useTheme } from './theme/useTheme'

export function App() {
  const { theme, toggleTheme } = useTheme()
  return (
    <main className="container">
      <MonitorCog size={24} />
      <button onClick={toggleTheme}>theme: {theme}</button>
    </main>
  )
}
