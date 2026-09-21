import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchIcon } from '../../../shared/components'
import {
  getPokemonCatalogApi,
  getPokemonDetailsBatchApi,
  getStoredPokemonPageApi,
  POKEMON_PAGE_SIZE,
  saveStoredPokemonPageApi,
} from '../api/home.api'
import type { PokemonDetails, PokemonSummary } from '../home.type'

export function PokeList() {
  const [catalog, setCatalog] = useState<PokemonSummary[]>([])
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([])
  const [currentPage, setCurrentPage] = useState(getStoredPokemonPageApi)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredCatalog = useMemo(() => {
    if (!normalizedSearchTerm) {
      return catalog
    }

    return catalog.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedSearchTerm),
    )
  }, [catalog, normalizedSearchTerm])
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCatalog.length / POKEMON_PAGE_SIZE),
  )
  const startIndex = (currentPage - 1) * POKEMON_PAGE_SIZE
  const pageCatalog = useMemo(
    () => filteredCatalog.slice(startIndex, startIndex + POKEMON_PAGE_SIZE),
    [filteredCatalog, startIndex],
  )

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsCatalogLoading(true)
      setError(null)

      try {
        const response = await getPokemonCatalogApi()

        if (isMounted) {
          setCatalog(response)
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Could not load Pokemon list.',
          )
        }
      } finally {
        if (isMounted) {
          setIsCatalogLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    saveStoredPokemonPageApi(currentPage)
  }, [currentPage])

  useEffect(() => {
    let isMounted = true

    async function loadPokemonDetails() {
      if (pageCatalog.length === 0) {
        setPokemons([])
        setError(null)
        return
      }

      setIsDetailsLoading(true)
      setError(null)

      try {
        const response = await getPokemonDetailsBatchApi(pageCatalog)

        if (isMounted) {
          setPokemons(response)
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
          setIsDetailsLoading(false)
        }
      }
    }

    loadPokemonDetails()

    return () => {
      isMounted = false
    }
  }, [pageCatalog])

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  const isLoading = isCatalogLoading || isDetailsLoading

  return (
    <section className="poke-list" aria-label="Pokemon list">
      <div className="poke-list__panel">
        <div className="textbox poke-list__search">
          <span className="textbox__icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            className="textbox__control"
            type="search"
            aria-label="Search Pokemon"
            placeholder="Search Pokemon"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="poke-list__status">
          {error ? <p className="field__error">{error}</p> : null}
          {isLoading ? <p className="field__hint">Loading Pokemon...</p> : null}
        </div>

        <div className="poke-list__content">
          <div className="poke-list__grid">
            {pokemons.map((pokemon) => (
              <Link
                className="poke-card"
                key={pokemon.id}
                to={`/home/pokemon/${pokemon.id}`}
              >
                <div className="poke-card__image">
                  {pokemon.image ? (
                    <img src={pokemon.image} alt={formatPokemonName(pokemon.name)} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="poke-card__body">
                  <h2>{formatPokemonName(pokemon.name)}</h2>
                  <p>Abilities</p>
                  <span>
                    {pokemon.abilities
                      .slice(0, 2)
                      .map(formatPokemonName)
                      .join(', ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {!isLoading && pokemons.length === 0 ? (
            <p className="poke-list__empty">No Pokemon found.</p>
          ) : null}
        </div>

        <div className="poke-list__pagination">
          <button
            className="button button--subtle"
            type="button"
            disabled={currentPage <= 1}
            onClick={goToPreviousPage}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="button button--subtle"
            type="button"
            disabled={currentPage >= totalPages}
            onClick={goToNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

function formatPokemonName(name: string) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
