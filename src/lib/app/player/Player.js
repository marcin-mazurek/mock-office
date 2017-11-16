import { Subject } from 'rxjs';
import Scenario from './Scenario';

export default class Player {
  constructor(eventBus) {
    this.scenario = new Scenario();
    this.eventBus = eventBus;
    this.$lifecycle = new Subject();
  }

  // add :: (String, Object) -> Mock
  add(type, cfg) {
    switch (type) {
      case 'mock': {
        const mock = this.scenario.addMock(cfg);
        this.$lifecycle.merge(mock.getStatusChanges());
        return mock;
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
