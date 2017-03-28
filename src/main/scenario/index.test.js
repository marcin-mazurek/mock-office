/* eslint-disable global-require */
const scenarioModule = require('./index');

const Scenario = scenarioModule.default;
const extractSubTree = scenarioModule.extractSubTree;

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
      const scenario = new Scenario({ id: 'scenario id' });
      expect(scenario).toHaveProperty('scenes');
    });
  });

  describe('createScene', () => {
    it('should add random generated id', () => {
      const descConfig = {};
      const desc = Scenario.createScene(descConfig);

      expect(desc).toHaveProperty('id');
      expect(typeof desc.id).toEqual('string');
    });
  });

  describe('addScene', () => {
    it('should add scene to scenario', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.addScene({});
      expect(scenario.scenes).toHaveLength(1);
      scenario.addScene({});
      expect(scenario.scenes).toHaveLength(2);
    });
  });

  describe('removeScene', () => {
    it('should remove scene from scenario scenes list', () => {
      const scenario = new Scenario({ id: 'scenario id' });
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
      const scenario = new Scenario({ id: 'scenario id' });
      const scene = {
        id: 'some id',
        scene: mockScene
      };
      scenario.scenes = [
        scene
      ];
      expect(scenario.findScene()).toBe(scene);

      const scenario2 = new Scenario({ id: 'scenario id' });
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
    it('should cancel all active schedulers', () => {
      const mockDispose = jest.fn();
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.scenes = [{
        scheduled: true,
        dispose: mockDispose
      }];
      scenario.cancelPendingScenes();
      expect(mockDispose).toHaveBeenCalled();
    });
  });

  describe('attemptToRemoveScene', () => {
    it('should remove scene if won\'t used anymore', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.scenes = [
        {
          id: 'some id',
          parts: []
        }
      ];
      scenario.attemptToRemoveScene('some id');
      expect(scenario.scenes).toHaveLength(0);
    });

    it('should do anything if scene should be reused infinitely', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.scenes = [
        {
          id: 'reuse infinite id',
          reuse: 'infinite'
        }
      ];
      scenario.attemptToRemoveScene('reuse infinite id');
      expect(scenario.scenes).toHaveLength(1);
    });

    it('should manage quantity if scene should be reused certain number of times', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.scenes = [
        {
          id: 'reuse fixed id',
          reuse: 'fixed',
          quantity: 1,
          parts: []
        }
      ];
      scenario.attemptToRemoveScene('reuse fixed id');
      expect(scenario.scenes).toHaveLength(1);
      expect(scenario.scenes[0].quantity).toEqual(0);
      scenario.attemptToRemoveScene('reuse fixed id');
      expect(scenario.scenes).toHaveLength(0);
    });
  });
});
