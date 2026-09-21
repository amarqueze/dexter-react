import { useState } from 'react'
import { createTrainerApi } from '../api/login.api'
import type { NewTrainerFormValues, Trainer } from '../login.type'

export function useCreateTrainer() {
  const [data, setData] = useState<Trainer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function createTrainer(values: NewTrainerFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await createTrainerApi(values)
      setData(response)
      return response
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo crear el entrenador.',
      )
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTrainer,
    data,
    error,
    isLoading,
  }
}
