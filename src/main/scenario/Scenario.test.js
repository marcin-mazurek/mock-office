/* eslint-disable global-require */
import Scenario, { extractSubTree } from './Scenario';
import { ServerEventsEmitter } from '../globalEvents';

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
    it('should initialize list of scenes', () => {
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
      expect(scenario).toHaveProperty('scenes');
    });
  });

  describe('addScene', () => {
    it('should add scene to scenario', () => {
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
      scenario.addScene({ parts: [] });
      expect(scenario.scenes).toHaveLength(1);
      scenario.addScene({ parts: [] });
      expect(scenario.scenes).toHaveLength(2);
    });
  });

  describe('removeScene', () => {
    it('should remove scene from scenario scenes list', () => {
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
      scenario.scenes = [
        {
          id: 'some id',
          parts: []
        },
        {
          id: 'some id2',
          parts: []
        }
      ];
      scenario.removeScene('some id');
      expect(scenario.scenes).toHaveLength(1);
    });
  });

  describe('findScene', () => {
    it('should find scene scene if not yet scheduled', () => {
      const mockScene = jest.fn();
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
      const scene = {
        id: 'some id',
        scene: mockScene
      };
      scenario.scenes = [
        scene
      ];
      expect(scenario.findScene()).toBe(scene);

      const scenario2 = new Scenario({ emitter: new ServerEventsEmitter() });
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
    it('should cancel all active scene parts', () => {
      const cancelMock = jest.fn();
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
      scenario.scenes = [
        {
          pending: true,
          cancel: cancelMock
        },
        {
          pending: false,
          cancel: cancelMock
        },
        {
          pending: true,
          cancel: cancelMock
        }
      ];
      scenario.cancelPendingScenes();
      expect(cancelMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('play', () => {
    it.only('should remove scene if it shouldn\'t be reused', () => {
      const scenario = new Scenario({ emitter: new ServerEventsEmitter() });
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
