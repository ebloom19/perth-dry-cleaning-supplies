import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Brief description of the category (optional)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category image for featured displays (optional)',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        required: true,
        admin: {
          position: undefined,
        },
      },
    }),
  ],
}
