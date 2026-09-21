import type { HomePageTitle, PokemonDetails, PokemonSummary } from '../home.type'

export const POKEMON_PAGE_SIZE = 20

const ALL_POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
const POKEMON_DETAIL_URL = 'https://pokeapi.co/api/v2/pokemon'
const POKEMON_CATALOG_STORAGE_KEY = 'dexter.pokedex.catalog'
const POKEMON_DETAILS_STORAGE_KEY = 'dexter.pokedex.details'
const POKEMON_PAGE_STORAGE_KEY = 'dexter.pokedex.page'

let pokemonCatalogRequest: Promise<PokemonSummary[]> | null = null
const pokemonDetailsRequests = new Map<number, Promise<PokemonDetails>>()

type PokeApiListResponse = {
  results: Array<{
    name: string
    url: string
  }>
}

type PokeApiDetailResponse = {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  types: Array<{
    type: {
      name: string
    }
  }>
  sprites: {
    front_default: string | null
  }
}

export async function getHomeTitleApi(): Promise<HomePageTitle> {
  return Promise.resolve({
    title: 'Welcome to pokedex',
  })
}

export async function getPokemonCatalogApi(): Promise<PokemonSummary[]> {
  const storedCatalog = readStorageValue(
    POKEMON_CATALOG_STORAGE_KEY,
    isPokemonSummaryArray,
  )

  if (storedCatalog) {
    return storedCatalog
  }

  pokemonCatalogRequest ??= fetchPokemonCatalogApi()

  try {
    return await pokemonCatalogRequest
  } finally {
    pokemonCatalogRequest = null
  }
}

async function fetchPokemonCatalogApi(): Promise<PokemonSummary[]> {
  const response = await fetch(ALL_POKEMON_URL)

  if (!response.ok) {
    throw new Error('Could not load Pokemon list.')
  }

  const data = (await response.json()) as PokeApiListResponse
  const catalog = data.results
    .map((pokemon) => ({
      id: getPokemonIdFromUrl(pokemon.url),
      name: pokemon.name,
      url: pokemon.url,
    }))
    .filter((pokemon): pokemon is PokemonSummary => pokemon.id !== null)

  writeStorageValue(POKEMON_CATALOG_STORAGE_KEY, catalog)

  return catalog
}

export async function getPokemonDetailsBatchApi(
  pokemons: PokemonSummary[],
): Promise<PokemonDetails[]> {
  const storedDetails = getStoredPokemonDetails()
  const missingPokemons = pokemons.filter(
    (pokemon) => !storedDetails[String(pokemon.id)],
  )

  if (missingPokemons.length > 0) {
    const fetchedDetails = await Promise.all(
      missingPokemons.map((pokemon) => getPokemonDetailsFromApi(pokemon.id)),
    )

    fetchedDetails.forEach((pokemon) => {
      storedDetails[String(pokemon.id)] = pokemon
    })

    writeStorageValue(POKEMON_DETAILS_STORAGE_KEY, storedDetails)
  }

  return pokemons
    .map((pokemon) => storedDetails[String(pokemon.id)])
    .filter(isPokemonDetails)
}

export async function getPokemonDetailsByIdApi(
  pokemonId: number,
): Promise<PokemonDetails> {
  const storedDetails = getStoredPokemonDetails()
  const storedPokemon = storedDetails[String(pokemonId)]

  if (storedPokemon) {
    return storedPokemon
  }

  const pokemon = await getPokemonDetailsFromApi(pokemonId)
  storedDetails[String(pokemon.id)] = pokemon
  writeStorageValue(POKEMON_DETAILS_STORAGE_KEY, storedDetails)

  return pokemon
}

export function getStoredPokemonPageApi() {
  if (typeof window === 'undefined') {
    return 1
  }

  const storedPage = Number(window.localStorage.getItem(POKEMON_PAGE_STORAGE_KEY))

  return Number.isInteger(storedPage) && storedPage > 0 ? storedPage : 1
}

export function saveStoredPokemonPageApi(page: number) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(POKEMON_PAGE_STORAGE_KEY, String(page))
}

async function getPokemonDetailsFromApi(
  pokemonId: number,
): Promise<PokemonDetails> {
  const pendingRequest = pokemonDetailsRequests.get(pokemonId)

  if (pendingRequest) {
    return pendingRequest
  }

  const request = fetchPokemonDetailsFromApi(pokemonId).finally(() => {
    pokemonDetailsRequests.delete(pokemonId)
  })

  pokemonDetailsRequests.set(pokemonId, request)

  return request
}

async function fetchPokemonDetailsFromApi(
  pokemonId: number,
): Promise<PokemonDetails> {
  const response = await fetch(`${POKEMON_DETAIL_URL}/${pokemonId}`)

  if (!response.ok) {
    throw new Error('Could not load Pokemon details.')
  }

  const data = (await response.json()) as PokeApiDetailResponse

  return {
    id: data.id,
    name: data.name,
    baseExperience: data.base_experience,
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((ability) => ability.ability.name),
    types: data.types.map((type) => type.type.name),
    image: data.sprites.front_default,
  }
}

function getStoredPokemonDetails(): Record<string, PokemonDetails> {
  return (
    readStorageValue(POKEMON_DETAILS_STORAGE_KEY, isPokemonDetailsRecord) ?? {}
  )
}

function getPokemonIdFromUrl(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)

  return match ? Number(match[1]) : null
}

function readStorageValue<T>(
  key: string,
  validator: (value: unknown) => value is T,
) {
  if (typeof window === 'undefined') {
    return null
  }

  const storedValue = window.localStorage.getItem(key)

  if (!storedValue) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)
    return validator(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

function writeStorageValue(key: string, value: unknown) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function isPokemonSummaryArray(value: unknown): value is PokemonSummary[] {
  return Array.isArray(value) && value.every(isPokemonSummary)
}

function isPokemonSummary(value: unknown): value is PokemonSummary {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const pokemon = value as Partial<PokemonSummary>

  return (
    typeof pokemon.id === 'number' &&
    typeof pokemon.name === 'string' &&
    typeof pokemon.url === 'string'
  )
}

function isPokemonDetailsRecord(
  value: unknown,
): value is Record<string, PokemonDetails> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value as Record<string, unknown>).every(isPokemonDetails)
}

function isPokemonDetails(value: unknown): value is PokemonDetails {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const pokemon = value as Partial<PokemonDetails>

  return (
    typeof pokemon.id === 'number' &&
    typeof pokemon.name === 'string' &&
    typeof pokemon.baseExperience === 'number' &&
    typeof pokemon.height === 'number' &&
    typeof pokemon.weight === 'number' &&
    Array.isArray(pokemon.abilities) &&
    pokemon.abilities.every((ability) => typeof ability === 'string') &&
    Array.isArray(pokemon.types) &&
    pokemon.types.every((type) => typeof type === 'string') &&
    (typeof pokemon.image === 'string' || pokemon.image === null)
  )
}
