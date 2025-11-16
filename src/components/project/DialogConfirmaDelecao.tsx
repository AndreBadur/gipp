import { RefObject } from 'react'
import { Button } from '../ui/button'

export default function DialogConfirmaDelecao({
  dialogRef,
  onConfirm,
  temCerteza,
  estaAcao,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>
  onConfirm: () => Promise<void> | void
  temCerteza: string
  estaAcao: string
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg p-6 shadow-lg"
    >
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">{temCerteza}</h2>
        <p className="text-sm text-muted-foreground">{estaAcao}</p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              await onConfirm()
              dialogRef.current?.close()
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </dialog>
  )
}
