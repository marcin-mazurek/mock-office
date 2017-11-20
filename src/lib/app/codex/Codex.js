import Scenario from './Scenario';

export default class Codex {
  constructor() {
    this.scenario = new Scenario();
  }

  // add :: (String, Object) -> Behaviour
  add(type, cfg) {
    switch (type) {
      case 'mock': {
        return this.scenario.addBehaviour(cfg);
      }
      default: {
        return null;
      }
    }
  }

  // getBehaviour :: Object -> Behaviour
  getBehaviour(action) {
    const behaviour = this.scenario.find(action);

    if (!behaviour) {
      return null;
    }

    return behaviour;
  }
}
