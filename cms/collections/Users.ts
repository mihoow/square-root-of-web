import type { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { value: 'user', label: 'user' },
        { value: 'admin', label: 'admin' }
      ],
      defaultValue: 'user',
      admin: {
        width: '400px'
      }
    }
  ],
};

export default Users;