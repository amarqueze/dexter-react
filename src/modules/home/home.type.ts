export type HomePageTitle = {
  title: string
}

export type PokemonSummary = {
  id: number
  name: string
  url: string
}

export type PokemonDetails = {
  id: number
  name: string
  baseExperience: number
  height: number
  weight: number
  abilities: string[]
  types: string[]
  image: string | null
}
