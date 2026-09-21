import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresa tu correo.')
    .email('Ingresa un correo valido.'),
  password: z.string().min(1, 'Ingresa tu contrasena.'),
  rememberMe: z.boolean(),
})

export type LoginCredentials = z.infer<typeof loginSchema>

export type LoginUser = {
  id: string
  name: string
  email: string
}

export type LoginResponse = {
  token: string
  user: LoginUser
}

export const newTrainerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Ingresa el nombre.'),
    lastName: z.string().trim().min(1, 'Ingresa el apellido.'),
    email: z
      .string()
      .trim()
      .min(1, 'Ingresa el correo.')
      .email('Ingresa un correo valido.'),
    password: z
      .string()
      .min(6, 'La contrasena debe tener al menos 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma la contrasena.'),
    acceptedTerms: z
      .boolean()
      .refine((acceptedTerms) => acceptedTerms, {
        message: 'Debes aceptar los terminos y la politica.',
      }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contrasenas no coinciden.',
    path: ['confirmPassword'],
  })

export type NewTrainerFormValues = z.infer<typeof newTrainerSchema>

export type Trainer = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}
