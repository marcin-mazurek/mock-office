import Player from '../../../../src/lib/app/player/Player';

describe('Player', () => {
  describe('start', () => {
    it('should play scenario', () => {
      const player = new Player();
      const playScene = jest.fn();
      player.scenario.play = playScene;
      player.start();
      expect(playScene).toHaveBeenCalled();
    });
  });
});
