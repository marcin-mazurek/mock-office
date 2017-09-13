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
      expect(scenario).toHaveProperty('mocks');
    });
  });

  describe('addMock', () => {
    it('should add mock to scenario', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.addMock({ tasks: [] });
      expect(scenario.mocks).toHaveLength(1);
      scenario.addMock({ tasks: [] });
      expect(scenario.mocks).toHaveLength(2);
    });
  });

  describe('removeMock', () => {
    it('should remove mock from scenario mocks list', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.addMock({
        tasks: []
      });
      scenario.removeMock(scenario.mocks[0].id);
      expect(scenario.mocks).toHaveLength(0);
    });
  });

  describe('findMock', () => {
    it('should find mock mock if not yet scheduled', () => {
      const mockMock = jest.fn();
      const scenario = new Scenario({ emitter: new Emitter() });
      const mock = {
        id: 'some id',
        mock: mockMock
      };
      scenario.mocks = [
        mock
      ];
      expect(scenario.findMock()).toBe(mock);

      const scenario2 = new Scenario({ emitter: new Emitter() });
      const desc2 = {
        id: 'another id',
        requirements: {
          key: 'value'
        }
      };
      scenario2.mocks = [
        desc2
      ];
      expect(scenario2.findMock({
        key: 'value'
      })).toBe(desc2);

      expect(scenario2.findMock({
        key: 'value2'
      })).toBe(undefined);
    });
  });

  describe('cancelPendingMocks', () => {
    it('should cancel all active mock tasks', (done) => {
      const scenario = new Scenario({ emitter: new Emitter() });

      const futureMock = {
        tasks: [
          {
            type: 'future',
            payload: {},
            delay: 1000
          }
        ]
      };

      scenario.addMock(futureMock);
      scenario.addMock(futureMock);
      scenario.addMock(futureMock);
      Promise.all([
        scenario.play(scenario.mocks[0].id, () => {}),
        scenario.play(scenario.mocks[1].id, () => {}),
        scenario.play(scenario.mocks[2].id, () => {})
      ]).then((statuses) => {
        expect(statuses.every(finished => !finished)).toBeTruthy();
        expect(scenario.mocks.every(mock => mock.pending === false));
        done();
      });
      expect(scenario.mocks.every(mock => mock.pending === true)).toBeTruthy();
      scenario.cancelPendingMocks();
    });
  });

  describe('play', () => {
    it('should remove mock if it shouldn\'t be reused', () => {
      const scenario = new Scenario({ emitter: new Emitter() });
      scenario.mocks = [
        {
          id: 'some id',
          toRemove: true,
          tasks: [],
          play: () => Promise.resolve()
        },
        {
          id: 'another id',
          toRemove: false,
          tasks: [],
          play: () => Promise.resolve()
        }
      ];

      scenario.play('some id').then(() => {
        expect(scenario.mocks).toHaveLength(1);

        scenario.play('another id').then(() => {
          expect(scenario.mocks).toHaveLength(0);
        });
      });
    });
  });
});
