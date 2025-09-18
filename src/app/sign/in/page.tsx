'use client'

import LogoButton from '@/components/project/LogoButton'
import SignInForm from '@/components/project/SignInForm'

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <LogoButton />
      <SignInForm />
    </div>
  )
}
