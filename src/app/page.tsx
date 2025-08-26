'use client'

import LoginForm from '@/components/project/LoginForm'

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <p className="font-black text-7xl">G.I.I.P.</p>
      <LoginForm />
    </div>
  )
}
