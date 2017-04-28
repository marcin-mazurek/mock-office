import { Emitter, addListener } from '../servers-manager/emitter';
import Scene from './Scene';

describe('Scene', () => {
  it('should setup emitter', () => {
    const scene = new Scene({
      emitter: new Emitter(),
      parts: []
    });
    expect(scene.emitter).toBeInstanceOf(Emitter);
    expect(scene.emitter.params.sceneId).toEqual(scene.id);
  });

  describe('updateReuseStatus', () => {
    it('should update toRemove property according to reuse type', () => {
      const infinityScene = new Scene({
        emitter: new Emitter(),
        reuse: 'infinity',
        parts: []
      });
      infinityScene.updateReuseStatus();
      expect(infinityScene.toRemove).toBeFalsy();

      const twoTimesScene = new Scene({
        emitter: new Emitter(),
        reuse: 'fixed',
        quantity: 2,
        parts: []
      });
      twoTimesScene.updateReuseStatus();
      expect(twoTimesScene.toRemove).toBeFalsy();
      twoTimesScene.updateReuseStatus();
      expect(twoTimesScene.toRemove).toBeFalsy();
      twoTimesScene.updateReuseStatus();
      expect(twoTimesScene.toRemove).toBeTruthy();
    });
  });

  describe('play', () => {
    it('should update pending status', (done) => {
      const scene = new Scene({
        emitter: new Emitter(),
        reuse: 'infinity',
        parts: []
      });

      scene.play().then(() => {
        expect(scene.pending).toBeFalsy();
        done();
      });

      expect(scene.pending).toBeTruthy();
    });

    it('should marked scene as to remove', (done) => {
      const scene = new Scene({
        emitter: new Emitter(),
        parts: []
      });

      scene.play().then(() => {
        expect(scene.toRemove).toBeTruthy();
        done();
      });
    });

    it('should emit proper events on not cancelled scene', (done) => {
      const serverEE = new Emitter();
      const scene = new Scene({
        emitter: serverEE,
        parts: []
      });
      const sceneStartHandlerMock = jest.fn();
      const sceneEndHandlerMock = jest.fn();
      addListener('SCENE_START', sceneStartHandlerMock);
      addListener('SCENE_END', sceneEndHandlerMock);

      scene.play().then(() => {
        expect(sceneStartHandlerMock).toHaveBeenCalled();
        expect(sceneEndHandlerMock).toHaveBeenCalled();
        done();
      });
    });

    it('should emit proper events on cancelled scene', (done) => {
      const serverEE = new Emitter();
      const scene = new Scene({
        emitter: serverEE,
        parts: [
          {
            type: 'immediate',
            payload: {}
          }
        ]
      });

      const sceneCancelHandlerMock = jest.fn();
      addListener('SCENE_CANCEL', sceneCancelHandlerMock);

      scene.play(() => {
      }).then(
        () => {
          expect(sceneCancelHandlerMock).toHaveBeenCalled();
          done();
        }
      );
      scene.cancel();
    });
  });

  describe('cancel', () => {
    it('should cancel all parts and scene', (done) => {
      const scene = new Scene({
        emitter: new Emitter(),
        parts: [
          {
            type: 'immediate',
            payload: {}
          }
        ]
      });

      scene.play().then(() => {
        expect(scene.parts.every(part => part.pending === false)).toBeTruthy();
        expect(scene.pending).toBeFalsy();
        done();
      });
      scene.cancel();
    });
  });
});
