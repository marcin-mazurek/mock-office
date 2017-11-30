jest.mock('cuid', () => () => '');
jest.useFakeTimers();
const Reaction = require('../../../../../src/lib/app/codex/Reaction').default;

describe('Reaction', () => {
  describe('.execute', () => {
    it('should run action', () => {
      const reaction = new Reaction('', {});
      reaction.doCommand = jest.fn();
      reaction.execute();
      expect(reaction.doCommand).toHaveBeenCalled();
    });

    it('should return canceling function', () => {
      const reaction = new Reaction('', {
        schedule: {
          delay: 10
        }
      });
      reaction.action = jest.fn();
      const cancel = reaction.execute();
      setTimeout(() => {
        cancel();
      }, 5);
      jest.runAllTimers();
      expect(reaction.action).not.toHaveBeenCalled();
    });
  });

  describe('.createTask', () => {
    it('should create immediate task', () => {
      const reaction = new Reaction('', {});
      reaction.doCommand = jest.fn();
      reaction.execute();
      expect(reaction.doCommand).toHaveBeenCalled();
    });

    describe('given that we pass delay', () => {
      it('should create delayed task', () => {
        const reaction = new Reaction('', {
          schedule: {
            delay: 10
          }
        });
        reaction.doCommand = jest.fn();
        reaction.execute();

        setTimeout(() => {
          expect(reaction.doCommand).not.toHaveBeenCalled();
        }, 9);
        setTimeout(() => {
          expect(reaction.doCommand).toHaveBeenCalled();
        }, 11);
        jest.runAllTimers();
      });
    });

    describe('given that we pass interval', () => {
      it('should create interval task', () => {
        const reaction = new Reaction('', {
          schedule: {
            interval: 3
          }
        });
        reaction.doCommand = jest.fn();
        reaction.execute();
        jest.runTimersToTime(9);
        expect(reaction.doCommand).toHaveBeenCalledTimes(3);
      });
    });

    describe('givent that we pass delay and interval', () => {
      it('should create delayed interval task', () => {
        const reaction = new Reaction('', {
          schedule: {
            interval: 3,
            delay: 3
          }
        });
        reaction.doCommand = jest.fn();
        reaction.execute();
        jest.runTimersToTime(13);
        expect(reaction.doCommand).toHaveBeenCalledTimes(3);
      });
    });
  });
});
