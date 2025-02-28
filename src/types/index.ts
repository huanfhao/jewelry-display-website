export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  name: string | null
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
} 