import unique from 'node-unique';
import ScenePart from './ScenePart';

export default class Scene {
  constructor(args) {
    this.requirements = args.requirements;
    this.id = unique();
    this.emitter = args.emitter.extend({ sceneId: this.id });
    this.parts = [];
    this.pending = false;
    this.reuse = args.reuse;
    this.quantity = args.quantity || 0;
    this.parts = args.parts.map(
      partConfig => new ScenePart(
        {
          scheduleDetails: partConfig,
          emitter: this.emitter
        }
      )
    );
  }

  // void -> void
  updateReuseStatus() {
    if (this.reuse === 'fixed') {
      if (this.quantity === 0) {
        this.toRemove = true;
      }
      this.quantity -= 1;
    } else if (!this.reuse) {
      this.toRemove = true;
    }
  }

  // Function -> Promise
  play(action) {
    this.pending = true;
    this.emitter.emit('SCENE_START');

    return Promise.all(this.parts.map(part => part.play(action))).then(
      () => {
        this.pending = false;
        this.updateReuseStatus();
        this.emitter.emit('SCENE_END');
      },
      () => {
        this.pending = false;
        this.emitter.emit('SCENE_CANCEL');
      }
    );
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.parts.forEach(part => part.cancel());
    }
  }
}
