import type {
  LoginCredentials,
  LoginResponse,
  NewTrainerFormValues,
  Trainer,
} from '../login.type'

const TRAINERS_STORAGE_KEY = 'dexter.trainers'

type StoredTrainer = Trainer & {
  password: string
}

function getStoredTrainers(): StoredTrainer[] {
  if (typeof window === 'undefined') {
    return []
  }

  const storedValue = window.localStorage.getItem(TRAINERS_STORAGE_KEY)

  if (!storedValue) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isStoredTrainer)
  } catch {
    return []
  }
}

function isStoredTrainer(value: unknown): value is StoredTrainer {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const trainer = value as Partial<StoredTrainer>

  return (
    typeof trainer.id === 'string' &&
    typeof trainer.firstName === 'string' &&
    typeof trainer.lastName === 'string' &&
    typeof trainer.email === 'string' &&
    typeof trainer.password === 'string' &&
    typeof trainer.createdAt === 'string'
  )
}

function saveStoredTrainers(trainers: StoredTrainer[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(TRAINERS_STORAGE_KEY, JSON.stringify(trainers))
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `trainer-${Date.now()}`
}

export async function loginApi(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const email = credentials.email.trim().toLowerCase()
  const trainer = getStoredTrainers().find(
    (storedTrainer) => storedTrainer.email === email,
  )

  if (!trainer || trainer.password !== credentials.password) {
    throw new Error('Email or password is incorrect.')
  }

  return Promise.resolve({
    token: `demo-token-${trainer.id}`,
    user: {
      id: trainer.id,
      name: `${trainer.firstName} ${trainer.lastName}`,
      email: trainer.email,
    },
  })
}

export async function createTrainerApi(
  values: NewTrainerFormValues,
): Promise<Trainer> {
  const firstName = values.firstName.trim()
  const lastName = values.lastName.trim()
  const email = values.email.trim().toLowerCase()
  const password = values.password.trim()
  const confirmPassword = values.confirmPassword.trim()

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new Error('Complete all fields.')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.')
  }

  if (!values.acceptedTerms) {
    throw new Error('You must accept the terms and privacy policy.')
  }

  const trainers = getStoredTrainers()
  const trainerExists = trainers.some((trainer) => trainer.email === email)

  if (trainerExists) {
    throw new Error('An account with this email already exists.')
  }

  const trainer: StoredTrainer = {
    id: createId(),
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  saveStoredTrainers([...trainers, trainer])

  return Promise.resolve({
    id: trainer.id,
    firstName: trainer.firstName,
    lastName: trainer.lastName,
    email: trainer.email,
    createdAt: trainer.createdAt,
  })
}
