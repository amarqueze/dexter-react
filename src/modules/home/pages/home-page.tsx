import { useParams } from 'react-router-dom'
import { Header } from '../../../shared/components'
import { useAuth } from '../../login/hooks/use-auth'
import { PokeDetails } from '../components/poke-details'
import { PokeList } from '../components/poke-list'
import '../home.css'

export function HomePage() {
  const { logout, user } = useAuth()
  const { pokemonId } = useParams()
  const numericPokemonId = pokemonId ? Number(pokemonId) : null
  const selectedPokemonId =
    numericPokemonId !== null &&
    Number.isInteger(numericPokemonId) &&
    numericPokemonId > 0
      ? numericPokemonId
      : null

  return (
    <div className="home-shell">
      <Header onLogout={logout} userName={user?.name ?? 'Trainer'} />

      <main className="home-page">
        {selectedPokemonId ? (
          <PokeDetails pokemonId={selectedPokemonId} />
        ) : (
          <PokeList />
        )}
      </main>
    </div>
  )
}
