/* eslint-disable global-require */
import Scenario, { extractSubTree } from './Scenario';
import { Emitter } from '../serversManager/emitter';

describe('extractSubTree', () => {
  it('should trim shallow primitive values', () => {
    const target = {
      a: 'a',
      b: 'b'
    };
    const source = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd'
    };
    expect(extractSubTree(source, target)).toEqual({
      a: 'a',
      b: 'b'
    });
  });

  it('should trim nested objects', () => {
    const target = {
      a: 'a',
      nested: {
        a: 'a'
      }
    };
    const source = {
      a: 'a',
      nested: {
        a: 'a',
        b: 'b'
      }
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a',
      nested: {
        a: 'a'
      }
    });
  });

  it('should copy arrays', () => {
    const target = {
      a: 'a',
      array: ['a', 'b']
    };
    const source = {
      a: 'a',
      array: ['a', 'b', 'c']
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a',
      array: ['a', 'b', 'c']
    });
  });

  it('should skip target objects not reflected in source', () => {
    const target = {
      a: 'a',
      obj: {
        a: 'a'
      }
    };
    const source = {
      a: 'a',
      b: ''
    };
    expect(extractSubTree(source, target, {})).toEqual({
      a: 'a'
    });
  });
});

describe('Scenario', () => {
  describe('constructor', () => {
    it('should initialize list of mocks', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      expect(scenario).toHaveProperty('scenes');
    });
  });

  describe('addScene', () => {
    it('should add scene to scenario', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.addScene({ parts: [] });
      expect(scenario.scenes).toHaveLength(1);
      scenario.addScene({ parts: [] });
      expect(scenario.scenes).toHaveLength(2);
    });
  });

  describe('removeScene', () => {
    it('should remove scene from scenario mocks list', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.addScene({
        parts: []
      });
      scenario.removeScene(scenario.scenes[0].id);
      expect(scenario.scenes).toHaveLength(0);
    });
  });

  describe('findScene', () => {
    it('should find scene scene if not yet scheduled', () => {
      const mockScene = jest.fn();
      const scenario = new Scenario({ emitter: new Emitter() });
      const scene = {
        id: 'some id',
        scene: mockScene
      };
      scenario.scenes = [
        scene
      ];
      expect(scenario.findScene()).toBe(scene);

      const scenario2 = new Scenario({ emitter: new Emitter() });
      const desc2 = {
        id: 'another id',
        requirements: {
          key: 'value'
        }
      };
      scenario2.scenes = [
        desc2
      ];
      expect(scenario2.findScene({
        key: 'value'
      })).toBe(desc2);

      expect(scenario2.findScene({
        key: 'value2'
      })).toBe(undefined);
    });
  });

  describe('cancelPendingScenes', () => {
    it('should cancel all active scene parts', (done) => {
      const scenario = new Scenario({ emitter: new Emitter() });

      const futureScene = {
        parts: [
          {
            type: 'future',
            payload: {},
            delay: 1000
          }
        ]
      };

      scenario.addScene(futureScene);
      scenario.addScene(futureScene);
      scenario.addScene(futureScene);
      Promise.all([
        scenario.play(scenario.scenes[0].id, () => {}),
        scenario.play(scenario.scenes[1].id, () => {}),
        scenario.play(scenario.scenes[2].id, () => {})
      ]).then((statuses) => {
        expect(statuses.every(finished => !finished)).toBeTruthy();
        expect(scenario.scenes.every(scene => scene.pending === false));
        done();
      });
      expect(scenario.scenes.every(scene => scene.pending === true)).toBeTruthy();
      scenario.cancelPendingScenes();
    });
  });

  describe('play', () => {
    it('should remove scene if it shouldn\'t be reused', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.scenes = [
        {
          id: 'some id',
          toRemove: true,
          parts: [],
          play: () => Promise.resolve()
        },
        {
          id: 'another id',
          toRemove: false,
          parts: [],
          play: () => Promise.resolve()
        }
      ];

      scenario.play('some id').then(() => {
        expect(scenario.scenes).toHaveLength(1);

        scenario.play('another id').then(() => {
          expect(scenario.scenes).toHaveLength(0);
        });
      });
    });
  });
});
