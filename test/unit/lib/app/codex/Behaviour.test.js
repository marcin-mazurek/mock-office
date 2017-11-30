import Behaviour from '../../../../../src/lib/app/codex/Behaviour';

describe('Behaviour', () => {
  describe('.execute', () => {
    it('should do nothing if runCounter reaches loadedCounter', () => {
      const behaviour = new Behaviour('', {
        loadedCounter: 1,
        event: {},
        reactions: [
          {}
        ]
      });
      behaviour.execute();
      expect(behaviour.loadedCounter).toEqual(1);
      behaviour.execute();
      expect(behaviour.loadedCounter).toEqual(1);
    });

    it('should increment runCounter', () => {
      const behaviour = new Behaviour('', {
        event: {},
        reactions: [
          {}
        ],
        loadedCounter: 2
      });
      behaviour.execute();
      expect(behaviour.runCounter).toEqual(1);
      behaviour.execute();
      expect(behaviour.runCounter).toEqual(2);
    });

    it('should change status to pending', () => {
      const behaviour = new Behaviour('', {
        event: {},
        reactions: [{
          schedule: {
            delay: 2
          }
        }]
      });
      behaviour.execute();
      expect(behaviour.status).toEqual(Behaviour.statuses.PENDING);
    });

    it('should execute reactions', () => {
      const behaviour = new Behaviour('', {
        event: {},
        reactions: [
          {},
          {}
        ]
      });
      const executeMock = jest.fn();
      behaviour.reactions[0].execute = executeMock;
      behaviour.reactions[1].execute = executeMock;
      behaviour.execute();
      expect(executeMock).toHaveBeenCalledTimes(2);
    });

    it.only('should manage reaction cancelling functions', () => {
      jest.useFakeTimers();

      const behaviour = new Behaviour('', {
        event: {},
        reactions: [
          {
            schedule: {
              delay: 1
            }
          }
        ]
      });

      behaviour.execute();
      expect(behaviour.pendingReactions).toHaveLength(1);
      jest.runTimersToTime(2);
      expect(behaviour.pendingReactions).toHaveLength(0);
    });
  });
});
