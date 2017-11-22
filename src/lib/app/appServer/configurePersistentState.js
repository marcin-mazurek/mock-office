import fs from 'fs';
import Ajv from 'ajv';
import colors from 'colors/safe';

const PATH_TO_FILE = './chanState.json';
const schema = {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'running',
      'name',
      'type',
      'id',
      'behaviours'
    ],
    properties: {
      running: {
        type: 'boolean'
      },
      name: {
        type: 'string',
      },
      type: {
        type: 'string'
      },
      port: {
        type: 'number',
      },
      id: {
        type: 'string'
      },
      behaviours: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            requirements: {
              type: 'object'
            },
            reuse: {
              type: 'string'
            },
            reactions: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string'
                  },
                  type: {
                    type: 'string'
                  },
                  payload: {
                    type: 'object'
                  },
                  delay: {
                    type: 'number'
                  }
                },
                required: ['type']
              }
            }
          },
          required: ['reactions']
        }
      }
    }
  }
};

export default function configurePersistentState(serversManager) {
  const ajv = Ajv();
  function save() {
    fs.writeFileSync(PATH_TO_FILE, JSON.stringify(serversManager.getState()), 'utf8');
  }

  function validateFileContent(content) {
    if (!ajv.validate(schema, content)) {
      throw new Error('Corrupted persistent state file. Couldn\'t load saved state.');
    }
  }

  function restore() {
    fs.readFile(PATH_TO_FILE, (err, data) => {
      if (err) return;

      try {
        const persistentState = JSON.parse(data);
        validateFileContent(persistentState);
        serversManager.setState(persistentState);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(colors.red(e));
      }
    });
  }

  return {
    save,
    restore
  };
}
