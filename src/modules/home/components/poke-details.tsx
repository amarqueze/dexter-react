import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPokemonDetailsByIdApi } from '../api/home.api'
import type { PokemonDetails } from '../home.type'

type PokeDetailsProps = {
  pokemonId: number
}

export function PokeDetails({ pokemonId }: PokeDetailsProps) {
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPokemon() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getPokemonDetailsByIdApi(pokemonId)

        if (isMounted) {
          setPokemon(response)
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Could not load Pokemon details.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPokemon()

    return () => {
      isMounted = false
    }
  }, [pokemonId])

  function goBackToList() {
    navigate('/home')
  }

  return (
    <section className="poke-detail" aria-labelledby="poke-detail-title">
      <button
        className="button button--subtle poke-detail__back"
        type="button"
        onClick={goBackToList}
      >
        {'<'} Back
      </button>

      {isLoading ? <p className="field__hint">Loading Pokemon...</p> : null}
      {error ? <p className="field__error">{error}</p> : null}

      {pokemon ? (
        <article className="poke-detail__card">
          <header className="poke-detail__header">
            <span>#{pokemon.id}</span>
            <h2>{formatPokemonName(pokemon.name)}</h2>
          </header>

          <div className="poke-detail__image">
            {pokemon.image ? (
              <img src={pokemon.image} alt={formatPokemonName(pokemon.name)} />
            ) : (
              <span>No image</span>
            )}
          </div>

          <dl className="poke-detail__stats">
            <div>
              <dt>Base experience</dt>
              <dd>{pokemon.baseExperience}</dd>
            </div>
            <div>
              <dt>Height</dt>
              <dd>{pokemon.height}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{pokemon.weight}</dd>
            </div>
          </dl>

          <div className="poke-detail__section">
            <h3>Types</h3>
            <div className="poke-detail__tags">
              {pokemon.types.map((type) => (
                <span key={type}>{formatPokemonName(type)}</span>
              ))}
            </div>
          </div>

          <div className="poke-detail__section">
            <h3>Abilities</h3>
            <div className="poke-detail__tags">
              {pokemon.abilities.map((ability) => (
                <span key={ability}>{formatPokemonName(ability)}</span>
              ))}
            </div>
          </div>
        </article>
      ) : null}
    </section>
  )
}

function formatPokemonName(name: string) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
