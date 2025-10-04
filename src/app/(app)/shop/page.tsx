import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { ProductFilters } from '@/components/ProductFilters'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category, minPrice, maxPrice, inStock } = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Fetch categories for filter
  const categories = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: 'title',
  })

  // Build where clause
  const whereConditions: any[] = [
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  if (searchValue) {
    whereConditions.push({
      or: [
        {
          title: {
            like: searchValue,
          },
        },
        {
          description: {
            like: searchValue,
          },
        },
      ],
    })
  }

  if (category) {
    whereConditions.push({
      categories: {
        contains: category,
      },
    })
  }

  if (minPrice) {
    whereConditions.push({
      priceInUSD: {
        greater_than_equal: parseFloat(minPrice as string),
      },
    })
  }

  if (maxPrice) {
    whereConditions.push({
      priceInUSD: {
        less_than_equal: parseFloat(maxPrice as string),
      },
    })
  }

  if (inStock === 'true') {
    whereConditions.push({
      inventory: {
        greater_than: 0,
      },
    })
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
      inventory: true,
      enableVariants: true,
    },
    sort: (sort as string) || 'title',
    where: {
      and: whereConditions,
    },
    populate: {
      variants: {
        inventory: true,
        priceInUSD: true,
      },
    },
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters categories={categories.docs} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search Results Header */}
          {searchValue ? (
            <p className="mb-6 text-lg">
              {products.docs?.length === 0
                ? 'There are no products that match '
                : `Showing ${products.docs.length} ${resultsText} for `}
              <span className="font-bold">&quot;{searchValue}&quot;</span>
            </p>
          ) : (
            <h1 className="text-2xl font-bold mb-6">All Products</h1>
          )}

          {!searchValue && products.docs?.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-muted-foreground">
                No products found. Please try different filters.
              </p>
            </div>
          )}

          {products?.docs.length > 0 ? (
            <Suspense fallback={<ProductGridSkeleton />}>
              <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.docs.map((product) => {
                  return <ProductGridItem key={product.id} product={product} />
                })}
              </Grid>
            </Suspense>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </Grid>
  )
}
