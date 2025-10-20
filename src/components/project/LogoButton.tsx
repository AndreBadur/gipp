'use client'

import { redirect } from 'next/navigation'
import { Button } from '../ui/button'

export default function LogoButton() {
  function homePage() {
    redirect('/')
  }

  return (
    <Button
      variant="logo"
      size="lg"
      onClick={homePage}
      className="font-black text-4xl md:text-6xl lg:text-7xl h-auto p-4 hover:scale-105 transition-transform"
    >
      G.I.P.P.
    </Button>
  )
}
