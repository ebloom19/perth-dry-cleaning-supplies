import type {
  Category,
  FeaturedCategoriesBlock as FeaturedCategoriesBlockProps,
  Media,
} from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import type { DefaultDocumentIDType } from 'payload'
import { cn } from '@/utilities/cn'
import { Media as MediaComponent } from '@/components/Media'

export const FeaturedCategoriesBlock: React.FC<
  FeaturedCategoriesBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = ({ categories, heading, className }) => {
  if (!categories || categories.length === 0) return null

  const validCategories = categories.filter((cat) => typeof cat === 'object') as Category[]

  if (validCategories.length === 0) return null

  return (
    <section className={cn('container py-12', className)}>
      {heading && <h2 className="mb-8 text-3xl font-bold tracking-tight">{heading}</h2>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {validCategories.map((category) => {
          const image = category.image && typeof category.image === 'object' ? category.image : null

          return (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
            >
              {image ? (
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-md">
                  <MediaComponent
                    resource={image as Media}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                  />
                </div>
              ) : (
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              )}

              <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {category.title}
              </h3>

              {category.description && (
                <p className="mt-2 text-xs text-muted-foreground text-center line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
