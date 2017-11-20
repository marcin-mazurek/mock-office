import Scenario from './Scenario';

export default class Player {
  constructor(serverId) {
    this.serverId = serverId;
    this.scenario = new Scenario();
    this.playing = [];
  }

  // add :: (String, Object) -> Mock
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

  // start :: Object -> Observable
  start(requirements) {
    return this.scenario.play(requirements);
  }
}
