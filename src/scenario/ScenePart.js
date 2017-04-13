import unique from 'node-unique';
import createSchedule from './createSchedule';

export default class ScenePart {
  constructor(args) {
    this.id = unique();
    this.emitter = args.emitter.extend({ scenePartId: this.id });
    this.pending = false;
    this.scheduleDetails = args.scheduleDetails;
  }

  // Function -> Promise
  play(action) {
    if (this.pending) {
      return Promise.reject('Pending ScenePart cant be played.');
    }

    return new Promise((resolve) => {
      const schedule = createSchedule(this.scheduleDetails);

      this.subscription = schedule(
        action,
        () => {
          this.emitter.emit('SCENE_PART_START');
        },
        () => {
          this.emitter.emit('SCENE_PART_END');
          this.pending = false;
          resolve(true);
        }
      );

      this.pending = true;

      this.stop = () => {
        this.subscription.unsubscribe();
        this.emitter.emit('SCENE_PART_CANCEL');
        this.pending = false;
        resolve(false);
      };
    });
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.stop();
    }
  }
}
