'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { Category } from '@/payload-types'

type Props = {
  categories: Category[]
}

export function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const selectedCategory = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStockOnly = searchParams.get('inStock') === 'true'
  const searchQuery = searchParams.get('q')

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`/shop?${params.toString()}`)
  }

  const handleCategoryChange = (categoryId: number) => {
    updateFilters({ category: categoryId.toString() === selectedCategory ? null : categoryId.toString() })
  }

  const handleInStockChange = (checked: boolean) => {
    updateFilters({ inStock: checked ? 'true' : null })
  }

  const handlePriceChange = (min: string, max: string) => {
    updateFilters({
      minPrice: min || null,
      maxPrice: max || null,
    })
  }

  const clearFilters = () => {
    router.push(searchQuery ? `/shop?q=${searchQuery}` : '/shop')
  }

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) + (inStockOnly ? 1 : 0) + (minPrice || maxPrice ? 1 : 0)

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FiltersContent
          categories={categories}
          selectedCategory={selectedCategory}
          inStockOnly={inStockOnly}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={handleCategoryChange}
          onInStockChange={handleInStockChange}
          onPriceChange={handlePriceChange}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FiltersContent
                categories={categories}
                selectedCategory={selectedCategory}
                inStockOnly={inStockOnly}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategoryChange={handleCategoryChange}
                onInStockChange={handleInStockChange}
                onPriceChange={handlePriceChange}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

type FiltersContentProps = {
  categories: Category[]
  selectedCategory: string | null
  inStockOnly: boolean
  minPrice: string | null
  maxPrice: string | null
  onCategoryChange: (categoryId: number) => void
  onInStockChange: (checked: boolean) => void
  onPriceChange: (min: string, max: string) => void
  onClearFilters: () => void
  activeFiltersCount: number
}

function FiltersContent({
  categories,
  selectedCategory,
  inStockOnly,
  minPrice,
  maxPrice,
  onCategoryChange,
  onInStockChange,
  onPriceChange,
  onClearFilters,
  activeFiltersCount,
}: FiltersContentProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || '')
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || '')

  const applyPriceFilter = () => {
    onPriceChange(localMinPrice, localMaxPrice)
  }

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pb-4 border-b">
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
          </span>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id.toString()}
                  onCheckedChange={() => onCategoryChange(category.id)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={applyPriceFilter}
            className="w-full"
            disabled={!localMinPrice && !localMaxPrice}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={onInStockChange}
          />
          <label
            htmlFor="in-stock"
            className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In stock only
          </label>
        </div>
      </div>
    </div>
  )
}
