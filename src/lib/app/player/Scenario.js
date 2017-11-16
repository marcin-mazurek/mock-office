import unique from 'cuid';
import deepEqual from 'deep-equal';
import Mock from './Mock';
import extractSubTree from './extractSubTree';

export default class Scenario {
  constructor() {
    this.id = unique();
    this.mocks = [];
    this.addMock = this.addMock.bind(this);
    this.removeMock = this.removeMock.bind(this);
    this.play = this.play.bind(this);
    this.matchMock = this.matchMock.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  // addMock :: Object -> Mock
  addMock(mockConfig) {
    const mock = new Mock(this.id, mockConfig);
    this.mocks.push(mock);

    return mock;
  }

  // removeMock :: String -> Boolean
  removeMock(mockId) {
    const mockIndex = this.mocks.findIndex(mock => mock.id === mockId);

    if (mockIndex < 0) {
      return false;
    }

    const mock = this.mocks[mockIndex];
    mock.kill();
    this.mocks.splice(mockIndex, 1);

    return true;
  }

  // play:: (Object) -> Observable
  play(requirements) {
    const mock = this.matchMock(requirements);

    if (!mock) {
      return null;
    }

    return mock.start();
  }

  // matchMock :: Object -> Boolean
  matchMock(requirements) {
    return this.mocks.find((mock) => {
      if (!mock.requirements) {
        return true;
      }

      if (!requirements) {
        return false;
      }

      return deepEqual(mock.requirements, extractSubTree(requirements, mock.requirements));
    });
  }

  // cancel :: void -> void
  cancel() {
    this.mocks.forEach(mock => mock.cancel());
  }
}
