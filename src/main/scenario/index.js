/*
Scenario
- has list of instructions

Descriptions
- contains parameters for its scheduler
- contains requirements for findDescription
- contains scheduler config

examples:
1. http req
2. queue find instructions and return scheduler
3. server schedules sending response
4. server send response and remove instruction from queue
*/

import unique from 'node-unique';
import deepEqual from 'deep-equal';
import btoa from 'btoa';
import scheduler from '../scheduler';
import globalEvents from '../globalEvents';

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
    this.id = args.id;
    this.descriptions = [];
    this.find = this.find.bind(this);
    this.attemptToRemoveDescription = this.attemptToRemoveDescription.bind(this);
    this.onActionPlayed = this.onActionPlayed.bind(this);

    globalEvents.on('ACTION_PLAYED', this.onActionPlayed);
  }

  onActionPlayed(descriptionId) {
    const removed = this.attemptToRemoveDescription(descriptionId);

    if (removed) {
      globalEvents.emit(
        'DESCRIPTION_REMOVED',
        { serverId: this.id, descriptionId }
      );
    }
  }

  static createDescription(description) {
    return Object.assign(description, {
      id: unique()
    });
  }

  find(id) {
    return this.descriptions.find(desc => desc.id === id);
  }

  attemptToRemoveDescription(id) {
    const description = this.find(id);
    let shouldBeRemoved = false;

    // all scenarios get message and try to find it within theirs descriptions
    // if we emit more specified messages it wont be necessary
    if (description) {
      if (description.reuse === 'fixed') {
        if (description.quantity === 0) {
          shouldBeRemoved = true;
        }
        description.quantity -= 1;
      } else if (!description.reuse) {
        shouldBeRemoved = true;
      }

      if (shouldBeRemoved) {
        this.removeDescription(description.id);
      }
    }

    return shouldBeRemoved;
  }

  addDescription(descriptionConfig) {
    const description = Scenario.createDescription(descriptionConfig);
    this.descriptions.push(description);

    return description.id;
  }

  removeDescription(descriptionId) {
    const descriptionIndex =
      this.descriptions.findIndex(description => description.id === descriptionId);
    const description = this.descriptions[descriptionIndex];

    if (description.dispose) {
      description.dispose();
      description.dispose = undefined;
    }

    this.descriptions.splice(descriptionIndex, 1);
  }

  schedule(id, action) {
    const description = this.find(id);
    description.dispose = scheduler(action, description.payload);
    description.scheduled = true;
    globalEvents.emit('ACTION_SCHEDULED', description.id);
  }

  findDescription(requirements) {
    let descriptionToShedule;
    const len = this.descriptions.length;
    let i = 0;

    while (!descriptionToShedule && i < len) {
      const description = this.descriptions[i];

      if (!description.scheduled) {
        if (description.requirements) {
          const req = requirements;
          if (requirements) {
            if (description.requirements.type === 'b64') {
              req.message = btoa(requirements.message);
              req.type = 'b64';
            }

            if (
              deepEqual(description.requirements, extractSubTree(req, description.requirements))
            ) {
              descriptionToShedule = description;
            }
          }
        } else {
          descriptionToShedule = description;
        }
      }

      i += 1;
    }

    return descriptionToShedule || undefined;
  }

  cancelSchedulers() {
    const scheduledDescriptions = this.descriptions.filter(description => !!description.dispose);
    scheduledDescriptions.forEach(description => description.dispose());
    this.descriptions = scheduledDescriptions.map(description =>
      Object.assign(description, { dispose: undefined })
    );
  }
}
