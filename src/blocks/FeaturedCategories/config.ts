import type { Block } from 'payload'

export const FeaturedCategories: Block = {
  slug: 'featuredCategories',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Shop by Category',
      label: 'Section Heading',
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        isSortable: true,
      },
      hasMany: true,
      label: 'Categories to feature',
      maxRows: 6,
      minRows: 2,
      relationTo: 'categories',
      required: true,
    },
  ],
  interfaceName: 'FeaturedCategoriesBlock',
  labels: {
    plural: 'Featured Categories',
    singular: 'Featured Categories',
  },
}
