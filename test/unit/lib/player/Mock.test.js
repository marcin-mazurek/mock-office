import { Observable } from 'rxjs/Rx';
import Mock from '../../../../src/lib/app/player/Mock';

describe('Mock', () => {
  it('should has inactive status', () => {
    expect(new Mock('scenario id', { tasks: [{}] }).status).toEqual('inactive');
  });

  describe('start', () => {
    it('should return observable when mock has started', () => {
      const mock = new Mock('scenario-id', { tasks: [{}] });
      expect(mock.start()).toBeInstanceOf(Observable);
    });
  });
});
