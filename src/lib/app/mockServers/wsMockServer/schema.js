const wsSchema = {
  properties: {
    server: {
      type: 'string'
    },
    scenario: {
      type: 'string'
    },
    mock: {
      type: 'object',
      properties: {
        trigger: {
          type: 'object',
          properties: {
            type: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        },
        messages: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              content: {
                type: 'string'
              },
              delay: {
                type: 'number'
              },
              interval: {
                type: 'number'
              }
            }
          }
        }
      },
      required: ['trigger', 'messages']
    }
  },
  required: ['server', 'scenario', 'mock']
};