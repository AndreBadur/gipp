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
        // const user = await res.json()
        console.log('user no nextauth: ', res)
        if (res?.success && res.data.status == 200) {
          console.log('estou dentro do if')
          return {
            id: res.data.user.id.toString(),
            email: res.data.user.email,
            telefone: res.data.user.telefone,
          }
        }
        console.log('estou fora do if')
        return null
      },
    }),
  ],
})

export { handler as GET, handler as POST }
