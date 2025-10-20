import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--btn-primary))] text-white hover:bg-[hsl(var(--btn-primary-hover))] focus-visible:ring-[hsl(var(--btn-primary))]',
        destructive:
          'bg-[hsl(var(--btn-destructive))] text-white hover:bg-[hsl(var(--btn-destructive-hover))] focus-visible:ring-[hsl(var(--btn-destructive))]',
        outline:
          'border border-[hsl(var(--btn-outline-border))] bg-[hsl(var(--btn-outline-bg))] text-[hsl(var(--btn-outline-text))] hover:bg-[hsl(var(--btn-outline-hover))] focus-visible:ring-slate-950',
        secondary:
          'bg-[hsl(var(--btn-secondary))] text-[hsl(var(--btn-secondary-text))] hover:bg-[hsl(var(--btn-secondary-hover))] focus-visible:ring-slate-950',
        ghost:
          'text-[hsl(var(--btn-ghost-text))] hover:bg-[hsl(var(--btn-ghost-hover))] hover:text-white focus-visible:ring-slate-950',
        link: 'text-[hsl(var(--btn-link))] underline-offset-4 hover:underline focus-visible:ring-[hsl(var(--btn-link))]',
        logo: 'text-[hsl(var(--btn-ghost-text))] hover:text-white focus-visible:ring-slate-950',
        confirm: 'bg-[hsl(var(--btn-confirm))] text-white hover:bg-[hsl(var(--btn-confirm-hover))] focus-visible:ring-[hsl(var(--btn-confirm))]',
        delete: 'bg-[hsl(var(--btn-delete))] text-white hover:bg-[hsl(var(--btn-delete-hover))] focus-visible:ring-[hsl(var(--btn-delete))]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
