import Player from '../../../../src/lib/app/codex/Player';

describe('Player', () => {
  describe('start', () => {
    it('should play scenario', () => {
      const codex = new Player();
      const playScene = jest.fn();
      codex.scenario.play = playScene;
      codex.start();
      expect(playScene).toHaveBeenCalled();
    });
  });
});
