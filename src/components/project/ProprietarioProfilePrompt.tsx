'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CadastroDeProprietarioForm from './CadastroDeProprietarioForm'

interface ProprietarioProfilePromptProps {
  shouldPrompt: boolean
}

export default function ProprietarioProfilePrompt({
  shouldPrompt,
}: ProprietarioProfilePromptProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [showForm, setShowForm] = useState(false)
  const pathname = usePathname()
  const lastPathRef = useRef<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!shouldPrompt) {
      lastPathRef.current = null
      if (dialog.open) {
        dialog.close()
      }
      return
    }

    const pathChanged = lastPathRef.current !== pathname
    if (pathChanged) {
      lastPathRef.current = pathname
    }

    if (pathChanged || !dialog.open) {
      setShowForm(false)
      dialog.showModal()
    }
  }, [pathname, shouldPrompt])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => setShowForm(false)

    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [])

  if (!shouldPrompt) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-secondary-background p-6 text-foreground shadow-2xl shadow-black/40"
    >
      {showForm ? (
        <CadastroDeProprietarioForm />
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Cadastre seu perfil</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Precisamos das informações do proprietário para liberar o acesso
              completo ao painel. Você pode preencher seus dados agora ou fazer
              isso mais tarde.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="confirm"
              onClick={() => setShowForm(true)}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      )}
    </dialog>
  )
}
