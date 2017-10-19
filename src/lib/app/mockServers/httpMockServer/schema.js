const httpMockSchema = {
  properties: {
    request: {
      type: 'object',
      properties: {
        method: {
          type: 'string'
        },
        path: {
          type: 'string'
        },
        headers: {
          type: 'object'
        },
        payload: {
          type: 'string'
        }
      }
    },
    response: {
      type: 'object',
      properties: {
        delay: {
          type: 'number'
        },
        status: {
          type: 'number'
        }
      }
    }
  },
  required: ['request', 'response']
};
