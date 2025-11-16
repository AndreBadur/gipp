'use client'

import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import CadastroDeProprietarioForm from '@/components/project/CadastroDeProprietarioForm'

export interface DialogProprietarioHandle {
  open: () => void
}

interface DialogProprietarioProps {
  showTriggerButton?: boolean
  renderTrigger?: (openDialog: () => void) => ReactNode
}

const DialogProprietario = forwardRef<
  DialogProprietarioHandle,
  DialogProprietarioProps
>(function DialogProprietario(
  { showTriggerButton = true, renderTrigger }: DialogProprietarioProps,
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  useImperativeHandle(
    ref,
    () => ({
      open: openDialog,
    }),
    []
  )

  const trigger = renderTrigger?.(openDialog) ?? (
    <Button onClick={openDialog} className="w-[20%]">
      Perfil do proprietário
    </Button>
  )

  return (
    <>
      {showTriggerButton && trigger}
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl rounded-lg border border-border bg-secondary-background p-4 shadow-2xl shadow-black/40"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Informações do Proprietário
          </h2>
        </div>
        <CadastroDeProprietarioForm />
      </dialog>
    </>
  )
})

export default DialogProprietario
