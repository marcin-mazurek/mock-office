import unique from 'cuid';
import deepEqual from 'deep-equal';
import Behaviour from './Behaviour';
import extractSubTree from './extractSubTree';

export default class Scenario {
  constructor() {
    this.id = unique();
    this.behaviours = [];
    this.addBehaviour = this.addBehaviour.bind(this);
    this.removeBehaviour = this.removeBehaviour.bind(this);
    this.find = this.find.bind(this);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    const behaviour = new Behaviour(this.id, behaviourCfg);
    this.behaviours.push(behaviour);

    return behaviour;
  }

  // removeMock :: String -> Boolean
  removeBehaviour(behaviourId) {
    const behaviourIndex = this.behaviours.findIndex(b => b.id === behaviourId);

    if (behaviourIndex < 0) {
      return false;
    }

    this.behaviours.splice(behaviourIndex, 1);

    return true;
  }

  // find :: Object -> Behaviour
  find(action) {
    return this.behaviours.find((b) => {
      if (!b.action) {
        return true;
      }

      if (!action) {
        return false;
      }

      return deepEqual(b.action, extractSubTree(action, b.action));
    });
  }
}
