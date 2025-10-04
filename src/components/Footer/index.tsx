import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon } from '@/components/icons/logo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')

  const copyrightName = COMPANY_NAME || SITE_NAME || 'Perth Dry Cleaning Supplies'

  // Fetch categories for footer
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    limit: 6,
    sort: 'title',
  })

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-neutral-200 py-12 dark:border-neutral-700">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link className="flex items-center gap-2 text-black mb-4 dark:text-white" href="/">
              <LogoIcon className="w-6" />
              <span className="font-semibold">{copyrightName}</span>
            </Link>
            <p className="text-xs mb-4">
              Professional dry cleaning supplies and equipment for Perth businesses and individuals.
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Perth, Western Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Mon-Fri: 9AM-5PM</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories.docs.length > 0 && (
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Shop by Category</h3>
              <ul className="space-y-2">
                {categories.docs.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/shop?category=${category.id}`}
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4">Quick Links</h3>
            <Suspense fallback={null}>
              <FooterMenu menu={menu} />
            </Suspense>
          </div>

          {/* Customer Service & Theme */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Safety Information
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    My Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-xs dark:border-neutral-700">
        <div className="container mx-auto flex w-full flex-col items-center gap-2 md:flex-row md:gap-0">
          <p>
            &copy; {copyrightDate} {copyrightName}. All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>Perth, Western Australia</p>
          <p className="md:ml-auto text-neutral-400">
            Powered by{' '}
            <a
              className="hover:text-black dark:hover:text-white transition-colors"
              href="https://payloadcms.com"
            >
              Payload
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
