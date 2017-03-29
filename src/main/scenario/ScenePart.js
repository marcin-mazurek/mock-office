import unique from 'node-unique';
import createSchedule from './schedulers';

export default class ScenePart {
  constructor(args) {
    this.id = unique();
    this.emitter = args.emitter.extend({ scenePartId: this.id });
    this.pending = false;
    this.scheduleDetails = args.scheduleDetails;
  }

  // Function -> Promise
  play(action) {
    return new Promise((resolve) => {
      const schedule = createSchedule(this.scheduleDetails);
      this.subscription = schedule(
        () => {
          this.pending = true;
          action(this.payload);
        },
        () => {
          this.emitter('SCENE_PART_START');
        },
        () => {
          this.emitter('SCENE_PART_END');
          resolve();
        }
      );

      this.cancel = () => {
        this.subscription.unsubscribe();
        this.emitter('SCENE_PART_CANCEL');
        this.pending = false;
        resolve();
      };
    });
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.cancel();
    }
  }
}
