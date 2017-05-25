import unique from 'cuid';
import deepEqual from 'deep-equal';
import btoa from 'btoa';
import Mock from './Mock';

export const extractSubTree = (source, target, result) => {
  const res = result || {};
  const targetKeys = Object.keys(target);

  targetKeys.forEach((key) => {
    if (
      typeof target[key] === 'object' &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      res[key] = {};
      extractSubTree(source[key], target[key], res[key]);
    } else {
      res[key] = source[key];
    }
  });

  return res;
};

export default class Scenario {
  constructor(args) {
    this.id = unique();
    this.emitter = args.emitter.extend({ scenarioId: this.id });
    this.mocks = [];
    this.find = this.find.bind(this);
    this.addMock = this.addMock.bind(this);
    this.removeMock = this.removeMock.bind(this);
    this.play = this.play.bind(this);
    this.findMock = this.findMock.bind(this);
    this.cancelPendingMocks = this.cancelPendingMocks.bind(this);
  }

  find(id) {
    return this.mocks.find(desc => desc.id === id);
  }

  addMock(mockConfig) {
    const mock = new Mock(Object.assign(mockConfig, { emitter: this.emitter }));
    this.mocks.push(mock);

    return mock.id;
  }

  removeMock(mockId) {
    const mockIndex = this.mocks.findIndex(mock => mock.id === mockId);

    if (mockIndex < 0) {
      return false;
    }

    const mock = this.mocks[mockIndex];
    mock.cancel();
    this.mocks.splice(mockIndex, 1);

    return true;
  }

  // (String, Function) -> Promise
  play(id, action) {
    const mock = this.find(id);

    return mock.play(action).then(
      (finished) => {
        if (finished && mock.toRemove) {
          this.removeMock(id);
          this.emitter.emit('MOCK_REMOVED_AFTER_USE', { mockId: id, scenario: this.id, tasks: mock.tasks.map(task => task.id) });
        }

        return finished;
      }
    );
  }

  findMock(requirements) {
    return this.mocks.find((mock) => {
      if (!mock.pending) {
        if (mock.requirements) {
          const req = requirements;
          if (requirements) {
            if (mock.requirements.type === 'b64') {
              req.message = btoa(requirements.message);
              req.type = 'b64';
            }

            if (
              deepEqual(mock.requirements, extractSubTree(req, mock.requirements))
            ) {
              return true;
            }
          }
        } else {
          return true;
        }
      }

      return false;
    });
  }

  cancelPendingMocks() {
    this.mocks.forEach(mock => mock.cancel());
  }
}
