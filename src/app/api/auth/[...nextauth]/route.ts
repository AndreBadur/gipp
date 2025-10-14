import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { autenticarUsuario } from '@/app/frontend/use-cases/UsuarioCases'

const handler = NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
        },
        senha: {
          label: 'password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log('missing credentials')
          return null
        }

        const { email, senha } = credentials

        const res = await autenticarUsuario(email, senha)
        const user = JSON.parse(res.data)
        if (res.success) {
          return user
        }

        return null
      },
    }),
  ],
})

export { handler as GET, handler as POST }
