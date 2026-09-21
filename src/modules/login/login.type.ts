export type LoginCredentials = {
  email: string
  password: string
  rememberMe: boolean
}

export type LoginUser = {
  id: string
  name: string
  email: string
}

export type LoginResponse = {
  token: string
  user: LoginUser
}

export type NewTrainerFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
}

export type Trainer = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}
