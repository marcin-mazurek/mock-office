import { Observable } from 'rxjs';
import Scenario from '../../../../src/lib/app/player/Scenario';

describe('Scenario', () => {
  describe('removeScene', () => {
    it('should return true when succeeded', () => {
      const scenario = new Scenario();
      const scene = scenario.addScene({ tasks: [{}] });
      expect(scenario.removeScene(scene.id)).toBeTruthy();
    });

    it('should return false when failed', () => {
      const scenario = new Scenario();
      scenario.addScene({ tasks: [{}] });
      expect(scenario.removeScene('wrong id')).toBeFalsy();
    });

    it('should remove scene from scenes', () => {
      const scenario = new Scenario();
      const scene = scenario.addScene({ tasks: [{}] });
      scenario.removeScene(scene.id);
      expect(scenario.scenes).toHaveLength(0);
    });

    it('should kill scene', () => {
      const scenario = new Scenario();
      const scene = scenario.addScene({ tasks: [{}] });
      const killScene = jest.fn();
      scene.kill = killScene;
      scenario.removeScene(scene.id);
      expect(killScene).toHaveBeenCalled();
    });
  });

  describe('play', () => {
    it('should return null if requirements doesn\'t match scene', () => {
      const scenario = new Scenario();
      expect(scenario.play({})).toEqual(null);
    });

    it('should return observable if requirements doesn\'t match scene', () => {
      const scenario = new Scenario();
      scenario.addScene({ tasks: [{}] });
      expect(scenario.play({})).toBeInstanceOf(Observable);
    });
  });

  describe('matchScene', () => {
    it('should return true if requirements matches scene requirements', () => {
      const scenario = new Scenario();
      scenario.addScene({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchScene({
        prop: 'value'
      })).toBeTruthy();
    });

    it('should return false if requirements doesn\'t match scene requirements', () => {
      const scenario = new Scenario();
      scenario.addScene({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchScene({
        prop: 'value1'
      })).toBeFalsy();
    });

    it('should return false if we don\'t provide requirements', () => {
      const scenario = new Scenario();
      scenario.addScene({
        requirements: {
          prop: 'value'
        },
        tasks: [{}]
      });
      expect(scenario.matchScene()).toBeFalsy();
    });

    it('should return true if scene don\'t have requirements', () => {
      const scenario = new Scenario();
      scenario.addScene({
        tasks: [{}]
      });
      expect(scenario.matchScene({
        prop: 'value1'
      })).toBeTruthy();
    });
  });

  describe('cancel', () => {
    it('should cancel all scenes', () => {
      const scenario = new Scenario();
      const cancelScene = jest.fn();
      scenario.addScene({ tasks: [{}] }).cancel = cancelScene;
      scenario.addScene({ tasks: [{}] }).cancel = cancelScene;
      scenario.cancel();
      expect(cancelScene).toHaveBeenCalledTimes(2);
    });
  });
});
