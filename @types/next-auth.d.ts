import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      // Existing user properties
      name?: string | null
      email?: string | null
      image?: string | null
      isNewUser?: boolean | null
      userId?: string
      role?: string
    }
  }
}