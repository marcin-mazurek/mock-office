import { Observable } from 'rxjs';
import Scenario from '../../../../src/lib/app/codex/Scenario';

describe('Scenario', () => {
  describe('play', () => {
    it('should return null if requirements doesn\'t match scene', () => {
      const scenario = new Scenario();
      expect(scenario.play({})).toEqual(null);
    });

    it('should return observable if requirements doesn\'t match scene', () => {
      const scenario = new Scenario();
      scenario.addMock({ tasks: [{}] });
      expect(scenario.play({})).toBeInstanceOf(Observable);
    });
  });

  describe('matchMock', () => {
    it('should return true if requirements matches scene requirements', () => {
      const scenario = new Scenario();
      scenario.addMock({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchMock({
        prop: 'value'
      })).toBeTruthy();
    });

    it('should return false if requirements doesn\'t match scene requirements', () => {
      const scenario = new Scenario();
      scenario.addMock({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchMock({
        prop: 'value1'
      })).toBeFalsy();
    });

    it('should return false if we don\'t provide requirements', () => {
      const scenario = new Scenario();
      scenario.addMock({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchMock()).toBeFalsy();
    });

    it('should return true if scene don\'t have requirements', () => {
      const scenario = new Scenario();
      scenario.addMock({
        tasks: [{}]
      });
      expect(scenario.matchMock({
        prop: 'value1'
      })).toBeTruthy();
    });
  });

  describe('cancel', () => {
    it('should cancel all mocks', () => {
      const scenario = new Scenario();
      const cancelMock = jest.fn();
      scenario.addMock({ tasks: [{}] }).cancel = cancelMock;
      scenario.addMock({ tasks: [{}] }).cancel = cancelMock;
      scenario.cancel();
      expect(cancelMock).toHaveBeenCalledTimes(2);
    });
  });
});
