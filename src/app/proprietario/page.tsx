'use client'
import CadastroDeProprietarioForm from '@/components/project/CadastroDeProprietarioForm'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

export default function Page() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  return (
    <div className="flex flex-col">
      INFORMAÇÕES DO PROPRIETÁRIO
      <br />
      aqui teremos as informações referentes aos dados do proprietário
      <Button onClick={openDialog} className="w-[20%]">
        Cadastrar informações de proprietário
      </Button>
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] rounded-lg shadow-lg p-4"
      >
        <CadastroDeProprietarioForm />
      </dialog>
    </div>
  )
}
