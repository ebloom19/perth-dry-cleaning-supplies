import type { Product, Variant } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title, inventory, enableVariants } = product

  let price = priceInUSD

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }
  }

  // Calculate stock status
  const hasStock = enableVariants
    ? variants?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant.inventory > 0
      })
    : inventory && inventory > 0

  const isLowStock = enableVariants
    ? variants?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant.inventory > 0 && variant.inventory <= 5
      })
    : inventory && inventory > 0 && inventory <= 5

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  return (
    <Link className="relative inline-block h-full w-full group" href={`/products/${product.slug}`}>
      <div className="relative">
        {image ? (
          <Media
            className={clsx(
              'relative aspect-square object-cover border rounded-2xl p-8 bg-primary-foreground transition-all duration-300',
              'group-hover:border-primary/50 group-hover:shadow-md',
            )}
            height={80}
            imgClassName={clsx('h-full w-full object-cover rounded-2xl', {
              'transition duration-300 ease-in-out group-hover:scale-105': true,
            })}
            resource={image}
            width={80}
          />
        ) : (
          <div className="aspect-square border rounded-2xl p-8 bg-muted flex items-center justify-center">
            <svg
              className="w-16 h-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Stock Badge */}
        {!hasStock ? (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-md">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 right-3 bg-warning text-warning-foreground text-xs font-medium px-2 py-1 rounded-md">
            Low Stock
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-1">
        <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </div>

        {typeof price === 'number' && (
          <div className="text-sm font-semibold">
            <Price amount={price} />
          </div>
        )}

        {/* Quick add indicator on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
          View details →
        </div>
      </div>
    </Link>
  )
}
