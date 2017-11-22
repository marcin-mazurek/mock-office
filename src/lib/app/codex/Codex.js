import deepEqual from 'deep-equal';
import Behaviour from './Behaviour';
import extractSubTree from './extractSubTree';

export default class Codex {
  constructor() {
    this.behaviours = [];
    this.addBehaviour = this.addBehaviour.bind(this);
    this.removeBehaviour = this.removeBehaviour.bind(this);
    this.findBehaviour = this.matchBehaviour.bind(this);
  }

  // getBehaviour :: String -> Behaviour
  getBehaviour(id) {
    return this.behaviours.find(b => b.id === id);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    const behaviour = new Behaviour(behaviourCfg);
    this.behaviours.push(behaviour);

    return behaviour;
  }

  // removeBehaviour :: String -> Boolean
  removeBehaviour(behaviourId) {
    const behaviourIndex = this.behaviours.findIndex(b => b.id === behaviourId);

    if (behaviourIndex < 0) {
      return false;
    }

    this.behaviours.splice(behaviourIndex, 1);

    return true;
  }

  // matchBehaviour :: Object -> Behaviour
  matchBehaviour(action) {
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
