import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { autenticarUsuario } from '@/app/frontend/use-cases/UsuarioCases'

const handler = NextAuth({
  pages: {
    signIn: '/sign/in',
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
        if (res?.success && res.data.status == 200) {
          return {
            id: res.data.dataConnection.id.toString(),
            email: res.data.dataConnection.email,
          }
        }
        console.log('estou fora do if')
        return null
      },
    }),
  ],
})

export { handler as GET, handler as POST }
