import deepEqual from 'deep-equal';
import Behaviour from './Behaviour';
import extractSubTree from './extractSubTree';

export default class Codex {
  constructor(serverId) {
    this.serverId = serverId;
    this.behaviours = [];
    this.addBehaviour = this.addBehaviour.bind(this);
    this.removeBehaviour = this.removeBehaviour.bind(this);
    this.matchBehaviour = this.matchBehaviour.bind(this);
  }

  // getBehaviour :: String -> Behaviour
  getBehaviour(id) {
    return this.behaviours.find(b => b.id === id);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    const behaviour = new Behaviour(this.serverId, behaviourCfg);
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
  matchBehaviour(event) {
    const behaviour = this.behaviours.find((b) => {
      if (!b.event) {
        return true;
      }

      if (!event) {
        return false;
      }

      return deepEqual(b.event, extractSubTree(event, b.event));
    });
    return behaviour;
  }
}
