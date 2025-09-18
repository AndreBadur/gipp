'use client'

import LogoButton from '@/components/project/LogoButton'
import SignUpForm from '@/components/project/SignUpForm'

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-screen my-2 md:h-lvh">
      <LogoButton />
      <SignUpForm />
    </div>
  )
}
