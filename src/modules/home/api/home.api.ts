import type { HomePageTitle } from '../home.type'

export async function getHomeTitleApi(): Promise<HomePageTitle> {
  return Promise.resolve({
    title: 'Welcome to pokedex',
  })
}
