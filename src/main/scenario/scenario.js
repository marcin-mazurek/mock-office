import unique from 'node-unique';
import deepEqual from 'deep-equal';
import btoa from 'btoa';
import Scene from './Scene';

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
    this.id = unique();
    this.emitter = args.emitter.extend({ scenarioId: this.id });
    this.scenes = [];
    this.find = this.find.bind(this);
    this.addScene = this.addScene.bind(this);
    this.removeScene = this.removeScene.bind(this);
    this.play = this.play.bind(this);
    this.findScene = this.findScene.bind(this);
    this.cancelPendingScenes = this.cancelPendingScenes.bind(this);
  }

  find(id) {
    return this.scenes.find(desc => desc.id === id);
  }

  addScene(sceneConfig) {
    const scene = new Scene(Object.assign(sceneConfig, { emitter: this.emitter }));
    this.scenes.push(scene);

    return scene.id;
  }

  removeScene(sceneId) {
    console.log('sceneId', sceneId);
    const sceneIndex = this.scenes.findIndex(scene => scene.id === sceneId);
    console.log('sceneIndex', sceneIndex);
    const scene = this.scenes[sceneIndex];
    console.log(scene);

    scene.cancel();
    this.scenes.splice(sceneIndex, 1);
  }

  // (String, Function) -> Promise
  play(id, action) {
    const scene = this.find(id);

    return scene.play(action).then(
      () => {
        console.log('scenario then');
        if (scene.toRemove) {
          this.removeScene(id);
          scene.emitter.emit('SCENE_REMOVED');
        }
      },
      (err) => {
        console.log('scenario caught:', err);
      }
    );
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
    this.scenes.forEach(scene => scene.cancel());
  }
}
