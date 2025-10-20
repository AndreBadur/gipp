'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import CadastroDeProprietarioForm from '@/components/project/CadastroDeProprietarioForm'

export default function DialogProprietario() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  return (
    <>
      <Button onClick={openDialog} className="w-[20%]">
        Perfil do proprietário
      </Button>
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] rounded-lg shadow-lg p-4"
      >
        <CadastroDeProprietarioForm />
      </dialog>
    </>
  )
}
