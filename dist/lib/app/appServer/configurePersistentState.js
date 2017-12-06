'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configurePersistentState;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PATH_TO_FILE = './chanState.json';
var schema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['running', 'name', 'type', 'id', 'behaviours'],
    properties: {
      running: {
        type: 'boolean'
      },
      name: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      port: {
        type: 'number'
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
            event: {
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

function configurePersistentState(serversManager) {
  var ajv = (0, _ajv2.default)();
  function save() {
    _fs2.default.writeFileSync(PATH_TO_FILE, JSON.stringify(serversManager.getState()), 'utf8');
  }

  function validateFileContent(content) {
    if (!ajv.validate(schema, content)) {
      throw new Error('Corrupted persistent state file. Couldn\'t load saved state.');
    }
  }

  function restore() {
    _fs2.default.readFile(PATH_TO_FILE, function (err, data) {
      if (err) return;

      try {
        var persistentState = JSON.parse(data);
        validateFileContent(persistentState);
        serversManager.setState(persistentState);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(_safe2.default.red(e));
      }
    });
  }

  return {
    save: save,
    restore: restore
  };
}
//# sourceMappingURL=configurePersistentState.js.map