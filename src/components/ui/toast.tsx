'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
  onClose: () => void
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const variantStyles = {
    default: 'bg-background text-foreground border',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white'
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm',
        'animate-in slide-in-from-right-full',
        variantStyles[variant]
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{title}</h4>
          {description && <p className="text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-lg leading-none hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  )
}