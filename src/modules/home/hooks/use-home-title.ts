import { useEffect, useState } from 'react'
import { getHomeTitleApi } from '../api/home.api'
import type { HomePageTitle } from '../home.type'

export function useHomeTitle() {
  const [data, setData] = useState<HomePageTitle | null>(null)

  useEffect(() => {
    let isMounted = true

    getHomeTitleApi().then((response) => {
      if (isMounted) {
        setData(response)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    data,
  }
}
