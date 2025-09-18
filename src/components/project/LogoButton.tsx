'use client'

import { redirect } from 'next/navigation'

export default function LogoButton() {
  function homePage() {
    redirect('/')
  }

  return (
    <p className="font-black text-7xl cursor-pointer" onClick={homePage}>
      G.I.P.P.
    </p>
  )
}
