'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="relative z-20 border-b">
      <nav className="flex flex-col container pt-2">
        <div className="flex items-center md:items-end justify-between">
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <div className="flex w-full items-end justify-between">
            <div className="flex w-full items-end gap-6 md:w-1/3">
              <Link
                className="flex w-full items-center justify-center pt-4 pb-4 md:w-auto"
                href="/"
              >
                <LogoIcon className="w-6 h-auto" />
              </Link>
              {menu.length ? (
                <ul className="hidden gap-4 text-sm md:flex md:items-center">
                  {menu.map((item) => (
                    <li key={item.id}>
                      <CMSLink
                        {...item.link}
                        size={'clear'}
                        className={cn('relative navLink', {
                          active:
                            item.link.url && item.link.url !== '/'
                              ? pathname.includes(item.link.url)
                              : false,
                        })}
                        appearance="nav"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="flex justify-end md:w-1/3 gap-4">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Search bar - hidden on mobile, shown on desktop */}
        <div className="hidden md:block pb-3 pt-2">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        </div>
      </nav>
    </div>
  )
}
