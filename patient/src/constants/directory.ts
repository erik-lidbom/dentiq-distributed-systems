// Service Directory
export const services = {
  booking: {
    path: 'booking',
    query: {
      create: 'create',
      get: 'get',
      update: 'update',
      delete: 'delete',
      query: 'query',
      book: 'book',
    },
  },
  clinic: {
    path: 'clinic',
    query: {
      create: 'create',
      get: 'get',
      update: 'update',
      delete: 'delete',
      query: 'query',
    },
  },
  dentist: {
    path: 'dentist',
    query: {
      create: 'create',
      get: 'get',
      update: 'update',
      delete: 'delete',
      query: 'query',
    },
  },
  patient: {
    path: 'patient',
    query: {
      create: 'create',
      get: 'get',
      update: 'update',
      delete: 'delete',
      query: 'query',
    },
  } as Record<string, any>,
};
