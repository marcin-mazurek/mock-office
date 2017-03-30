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
    return new Promise((resolve, reject) => {
      const schedule = createSchedule(this.scheduleDetails);

      this.subscription = schedule(
        () => {
          action(this.scheduleDetails);
        },
        () => {
          this.emitter.emit('SCENE_PART_START');
        },
        () => {
          this.emitter.emit('SCENE_PART_END');
          this.pending = false;
          resolve();
        }
      );

      this.pending = true;

      this.stop = () => {
        this.subscription.unsubscribe();
        this.emitter.emit('SCENE_PART_CANCEL');
        this.pending = false;
        reject('SCENE_PART_CANCEL');
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
