/* eslint-disable global-require */
jest.mock('../scheduler', () =>
  (action) => {
    action();

    return () => {
    };
  }
);

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
    it('should initialize list of descriptions', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      expect(scenario).toHaveProperty('descriptions');
    });
  });

  describe('createDescription', () => {
    it('should add random generated id', () => {
      const descConfig = {};
      const desc = Scenario.createDescription(descConfig);

      expect(desc).toHaveProperty('id');
      expect(typeof desc.id).toEqual('string');
    });
  });

  describe('addDescription', () => {
    it('should add description to scenario', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.addDescription({});
      expect(scenario.descriptions).toHaveLength(1);
      scenario.addDescription({});
      expect(scenario.descriptions).toHaveLength(2);
    });
  });

  describe('removeDescription', () => {
    it('should remove description from scenario descriptions list', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'some id'
        },
        {
          id: 'some id2'
        }
      ];
      scenario.removeDescription('some id');
      expect(scenario.descriptions).toHaveLength(1);
    });
  });

  describe('findDescription', () => {
    it('should find description action if not yet scheduled', () => {
      const mockAction = jest.fn();
      const scenario = new Scenario({ id: 'scenario id' });
      const description = {
        id: 'some id',
        action: mockAction
      };
      scenario.descriptions = [
        description
      ];
      expect(scenario.findDescription()).toBe(description);

      const scenario2 = new Scenario({ id: 'scenario id' });
      const desc2 = {
        id: 'another id',
        requirements: {
          key: 'value'
        }
      };
      scenario2.descriptions = [
        desc2
      ];
      expect(scenario2.findDescription({
        key: 'value'
      })).toBe(desc2);

      expect(scenario2.findDescription({
        key: 'value2'
      })).toBe(undefined);
    });
  });

  describe('cancelSchedulers', () => {
    it('should cancel all active schedulers', () => {
      const mockDispose = jest.fn();
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [{
        scheduled: true,
        dispose: mockDispose
      }];
      scenario.cancelSchedulers();
      expect(mockDispose).toHaveBeenCalled();
    });
  });

  describe('schedule', () => {
    it('should schedule action if not yet scheduled', () => {
      const mockAction = jest.fn();
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'some id'
        }
      ];
      scenario.schedule('some id', mockAction);
      expect(mockAction).toHaveBeenCalled();
    });

    it('should set dispose function if had scheduled', () => {
      const mockAction = jest.fn();
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'some id'
        }
      ];
      scenario.schedule('some id', mockAction);
      expect(typeof scenario.descriptions[0].dispose).toEqual('function');
    });
  });

  describe('attemptToRemoveDescription', () => {
    it('should remove description if won\'t used anymore', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'some id'
        }
      ];
      scenario.attemptToRemoveDescription('some id');
      expect(scenario.descriptions).toHaveLength(0);
    });

    it('should do anything if description should be reused infinitely', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'reuse infinite id',
          reuse: 'infinite'
        }
      ];
      scenario.attemptToRemoveDescription('reuse infinite id');
      expect(scenario.descriptions).toHaveLength(1);
    });

    it('should manage quantity if description should be reused certain number of times', () => {
      const scenario = new Scenario({ id: 'scenario id' });
      scenario.descriptions = [
        {
          id: 'reuse fixed id',
          reuse: 'fixed',
          quantity: 1
        }
      ];
      scenario.attemptToRemoveDescription('reuse fixed id');
      expect(scenario.descriptions).toHaveLength(1);
      expect(scenario.descriptions[0].quantity).toEqual(0);
      scenario.attemptToRemoveDescription('reuse fixed id');
      expect(scenario.descriptions).toHaveLength(0);
    });
  });

  describe('onActionPlayed', () => {
    it('should emit DESCRIPTION_REMOVED event if description is removed', () => {
      const emitMock = jest.fn();
      jest.resetModules();

      jest.mock('../globalEvents', () => ({
        on() {

        },
        emit() {
          emitMock();
        }
      }));

      const Scenarioo = require('./index').default;
      const scenario = new Scenarioo({ id: 'scenario id' });
      scenario.descriptions = [{
        id: 'some id'
      }];
      scenario.onActionPlayed('some id');
      expect(emitMock).toHaveBeenCalled();
    });
  });
});
