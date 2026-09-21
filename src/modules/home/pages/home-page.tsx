import { useHomeTitle } from '../hooks/use-home-title'
import '../home.css'

export function HomePage() {
  const { data } = useHomeTitle()

  return (
    <main className="home-page">
      <h1>{data?.title ?? 'Welcome to pokedex'}</h1>
    </main>
  )
}
