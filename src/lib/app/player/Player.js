import Scenario from './Scenario';

export default class Player {
  constructor() {
    this.scenario = new Scenario();
  }

  add(type, cfg) {
    switch (type) {
      case 'mock': {
        return this.scenario.addMock(cfg);
      }
      default: {
        return null;
      }
    }
  }

  play(requirements) {
    return this.scenario.play(requirements);
  }

  get(entity, params) {
    switch (entity) {
      case 'scenario': {
        return this.scenario;
      }
      case 'mock': {
        const scenario = this.scenario;
        if (scenario) {
          return scenario.getMock(params.mockId);
        }

        return null;
      }
      default: {
        return null;
      }
    }
  }

  remove(entity, params) {
    switch (entity) {
      case 'mock': {
        return this.scenario.removeMock(params.mockId);
      }
      default: {
        return false;
      }
    }
  }
}
