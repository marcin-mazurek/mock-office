import unique from 'cuid';
import deepEqual from 'deep-equal';
import btoa from 'btoa';
import Mock from './Mock';
import extractSubTree from './extractSubTree';

export default class Scenario {
  constructor() {
    this.id = unique();
    this.mocks = [];
    this.getMock = this.getMock.bind(this);
    this.addMock = this.addMock.bind(this);
    this.removeMock = this.removeMock.bind(this);
    this.play = this.play.bind(this);
    this.matchMock = this.matchMock.bind(this);
    this.cancelPendingMocks = this.cancelPendingMocks.bind(this);
  }

  getAll() {
    return this.mocks.map(mock => this.getMock(mock.id));
  }

  getMock(id) {
    const mock = this.mocks.find(desc => desc.id === id);

    if (!mock) {
      return mock;
    }

    return {
      id: mock.id,
      requirements: mock.requirements,
      pending: mock.pending,
      runCounter: mock.runCounter,
      loadedCounter: mock.loadedCounter,
      tasks: mock.tasks.map(task => ({
        id: task.id,
        pending: task.pending,
        schedule: task.schedule,
        params: task.params
      }))
    };
  }

  addMock(mockConfig) {
    const mock = new Mock(mockConfig);
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
  play(id) {
    const mock = this.mocks.find(m => m.id === id);

    const $tasks = mock.play();

    $tasks.subscribe({
      complete: () => {
        if (mock.expired) {
          this.removeMock(id);
        }
      }
    });

    return $tasks;
  }

  matchMock(requirements) {
    return this.mocks.find((mock) => {
      if (!mock.pending) {
        if (mock.requirements) {
          const req = requirements;
          if (req) {
            if (mock.requirements.type === 'b64') {
              req.message = btoa(requirements.message);
              req.type = 'b64';
            }

            return deepEqual(mock.requirements, extractSubTree(req, mock.requirements));
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
