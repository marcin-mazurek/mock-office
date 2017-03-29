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

    scene.parts.forEach((part) => {
      /* eslint-disable no-param-reassign */
      if (part.pending) {
        part.stop();
        part.pending = false;
      }
      /* eslint-enable no-param-reassign */
    });

    this.scenes.splice(sceneIndex, 1);
  }

  play(id, action) {
    const scene = this.find(id);
    let finishedPartsCount = 0;

    scene.parts.forEach((part) => {
      /* eslint-disable no-param-reassign */
      const schedule = createSchedule(part);
      part.subscription = schedule(
        () => {
          part.pending = true;
          action(part);
        },
        () => {},
        () => {
          part.pending = false;
          finishedPartsCount += 1;

          if (finishedPartsCount === scene.parts.length) {
            globalEvents.emit('SCENE_END', { serverId: this.id, sceneId: scene.id });
            this.attemptToRemoveScene(scene.id);
          }
        }
      );

      part.stop = () => {
        part.subscription.unsubscribe();
        globalEvents.emit('SCENE_CANCEL', { serverId: this.id, sceneId: scene.id });
        part.pending = false;
      };
      scene.pending = true;
      /* eslint-enable no-param-reassign */
    });

    scene.pending = true;
    globalEvents.emit('SCENE_START', { serverId: this.id, sceneId: scene.id });
  }

  attemptToRemoveScene(id) {
    const scene = this.find(id);
    /* eslint-disable no-param-reassign */
    let shouldBeRemoved;

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
      globalEvents.emit('SCENE_REMOVED', { serverId: this.id, sceneId: scene.id });
    }
    /* eslint-enable no-param-reassign */
  }

  findScene(requirements) {
    return this.scenes.find((scene) => {
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
              return true;
            }
          }
        } else {
          return true;
        }
      }

      return false;
    });
  }

  cancelPendingScenes() {
    const pendingScenes = this.scenes.filter(scene => scene.pending);
    pendingScenes.forEach((scene) => {
      /* eslint-disable no-param-reassign */
      if (scene.pending) {
        scene.parts.forEach((part) => {
          if (part.pending) {
            part.stop();
            part.pending = false;
          }
        });

        scene.pending = false;
      }
      /* eslint-enable no-param-reassign */
    });
  }
}
