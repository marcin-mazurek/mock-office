/*
Schedulers
- predefined schedulers
- should emit events that action have been played
*/

import globalEvents from '../globalEvents';

class ActionScheduler {
  constructor() {
    this.schedule = this.schedule.bind(this);
    this.disposes = [];
  }

  schedule(action, description) {
    // pick rx scheduler, run scheduler and  emit action
    const scheduler = () => {
      action(description);
      globalEvents.emit('ACTION_PLAYED', description.id);

      return () => {};
    };

    const dispose = scheduler();

    // return dispose
    this.disposes.push({
      descriptionId: description.id,
      dispose
    });
  }
}

export default ActionScheduler;
