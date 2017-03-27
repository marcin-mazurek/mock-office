/*
 Scenario
 - has list of instructions

 Scenes
 - contains parameters for its scheduler
 - contains requirements for findScene
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
import createSchedule from './schedulers';
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
    this.scenes = [];
    this.find = this.find.bind(this);
  }

  static createScene(scene) {
    return Object.assign(scene, {
      id: unique()
    });
  }

  find(id) {
    return this.scenes.find(desc => desc.id === id);
  }

  addScene(sceneConfig) {
    const scene = Scenario.createScene(sceneConfig);
    this.scenes.push(scene);

    return scene.id;
  }

  removeScene(sceneId) {
    const sceneIndex =
      this.scenes.findIndex(scene => scene.id === sceneId);
    const scene = this.scenes[sceneIndex];

    if (scene.dispose) {
      scene.dispose();
      scene.dispose = undefined;
    }

    this.scenes.splice(sceneIndex, 1);
  }

  play(id, action) {
    const scene = this.find(id);
    const schedule = createSchedule(scene);

    const sceneStop = schedule(
      () => {
        action();
      },
      () => {
        globalEvents.emit('SCENE_START', { serverId: this.id, sceneId: scene.id });
      },
      () => {
        globalEvents.emit('SCENE_END', { serverId: this.id, sceneId: scene.id });
        scene.pending = false;

        let shouldBeRemoved = false;

        if (scene.reuse === 'fixed') {
          if (scene.quantity === 0) {
            shouldBeRemoved = true;
          }
          scene.quantity -= 1;
        } else if (!scene.reuse) {
          shouldBeRemoved = true;
        }

        if (shouldBeRemoved) {
          this.removeScene(scene.id);

          globalEvents.emit(
            'SCENE_REMOVED',
            { serverId: this.id, sceneId: scene.id }
          );
        }
      }
    );

    scene.stop = () => {
      sceneStop();
      globalEvents.emit('SCENE_CANCEL', { serverId: this.id, sceneId: scene.id });
      scene.pending = false;
    };
    scene.pending = true;
  }

  findScene(requirements) {
    let sceneToPlay;
    const len = this.scenes.length;
    let i = 0;

    while (!sceneToPlay && i < len) {
      const scene = this.scenes[i];

      if (!scene.scheduled) {
        if (scene.requirements) {
          const req = requirements;
          if (requirements) {
            if (scene.requirements.type === 'b64') {
              req.message = btoa(requirements.message);
              req.type = 'b64';
            }

            if (
              deepEqual(scene.requirements, extractSubTree(req, scene.requirements))
            ) {
              sceneToPlay = scene;
            }
          }
        } else {
          sceneToPlay = scene;
        }
      }

      i += 1;
    }

    return sceneToPlay;
  }

  cancelPendingScenes() {
    const pendingScenes = this.scenes.filter(scene => !!scene.dispose);
    pendingScenes.forEach(scene => scene.dispose());
    this.scenes = pendingScenes.map(scene =>
      Object.assign(scene, { dispose: undefined })
    );
  }
}
