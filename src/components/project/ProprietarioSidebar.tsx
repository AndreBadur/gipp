'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, X } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

export type ProprietarioNavItem = {
  label: string
  href?: string
  children?: ProprietarioNavItem[]
}

interface ProprietarioSidebarProps {
  items: ProprietarioNavItem[]
  isOpen: boolean
  onClose: () => void
}

export default function ProprietarioSidebar({
  items,
  isOpen,
  onClose,
}: ProprietarioSidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    items.reduce((acc, item) => {
      if (item.children?.length) {
        const key = item.href ?? item.label
        const isActive =
          (item.href && pathname.startsWith(item.href)) ||
          item.children.some((child) =>
            child.href ? pathname.startsWith(child.href) : false
          )
        acc[key] = isActive
      }
      return acc
    }, {} as Record<string, boolean>)
  )

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev }
      items.forEach((item) => {
        if (!item.children?.length) return
        const key = item.href ?? item.label
        const shouldBeOpen =
          (item.href && pathname.startsWith(item.href)) ||
          item.children.some((child) =>
            child.href ? pathname.startsWith(child.href) : false
          )
        if (shouldBeOpen) {
          next[key] = true
        } else if (!(key in prev)) {
          next[key] = false
        }
      })
      return next
    })
  }, [pathname, items])

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isItemActive = (item: ProprietarioNavItem) => {
    if (!item.href) return false
    if (item.href === '/proprietario') {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  function renderNavItem(item: ProprietarioNavItem, depth = 0) {
    const isParent = item.children?.length
    const href = item.href ?? '#'
    const isActive = isItemActive(item)

    if (isParent) {
      const key = item.href ?? item.label
      const isOpen = openSections[key] ?? false

      return (
        <div key={key} className="space-y-1">
          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
            )}
            onClick={() => toggleSection(key)}
          >
            {item.href ? (
              <Link
                href={href}
                className="flex-1"
                onClick={(event) => {
                  event.stopPropagation()
                  onClose()
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span className="flex-1">{item.label}</span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen ? 'rotate-180' : ''
              )}
            />
          </button>
          {isOpen && (
            <div className="space-y-1 pl-4">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'flex items-center rounded-md px-3 py-2 transition-colors',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-foreground/70 hover:bg-white/5 hover:text-foreground',
          depth > 0 && 'text-sm text-foreground/60'
        )}
        onClick={onClose}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <Fragment>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/40 bg-secondary-background/95 p-4 shadow-2xl shadow-black/40 transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 md:bg-secondary-background',
          {
            '-translate-x-full md:translate-x-0': !isOpen,
            'translate-x-0': isOpen,
          }
        )}
        aria-label="Navegação do proprietário"
      >
        <div className="mb-6 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/80"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 text-sm font-medium">
          {items.map((item) => renderNavItem(item))}
        </nav>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
    </Fragment>
  )
}
