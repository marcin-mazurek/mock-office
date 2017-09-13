import { Emitter, addListener } from '../serversManager/emitter';
import Mock from './Mock';

describe('Mock', () => {
  it('should setup emitter', () => {
    const mock = new Mock({
      emitter: new Emitter(),
      tasks: []
    });
    expect(mock.emitter).toBeInstanceOf(Emitter);
    expect(mock.emitter.params.mockId).toEqual(mock.id);
  });

  describe('updateReuseStatus', () => {
    it('should update toRemove property according to reuse type', () => {
      const infinityMock = new Mock({
        emitter: new Emitter(),
        reuse: 'infinity',
        tasks: []
      });
      infinityMock.updateReuseStatus();
      expect(infinityMock.toRemove).toBeFalsy();

      const twoTimesMock = new Mock({
        emitter: new Emitter(),
        reuse: 'fixed',
        quantity: 2,
        tasks: []
      });
      twoTimesMock.updateReuseStatus();
      expect(twoTimesMock.toRemove).toBeFalsy();
      twoTimesMock.updateReuseStatus();
      expect(twoTimesMock.toRemove).toBeFalsy();
      twoTimesMock.updateReuseStatus();
      expect(twoTimesMock.toRemove).toBeTruthy();
    });
  });

  describe('play', () => {
    it('should update pending status', (done) => {
      const mock = new Mock({
        emitter: new Emitter(),
        reuse: 'infinity',
        tasks: []
      });

      mock.play().then(() => {
        expect(mock.pending).toBeFalsy();
        done();
      });

      expect(mock.pending).toBeTruthy();
    });

    it('should marked mock as to remove', (done) => {
      const mock = new Mock({
        emitter: new Emitter(),
        tasks: []
      });

      mock.play().then(() => {
        expect(mock.toRemove).toBeTruthy();
        done();
      });
    });

    it('should emit proper events on not cancelled mock', (done) => {
      const serverEE = new Emitter();
      const mock = new Mock({
        emitter: serverEE,
        tasks: []
      });
      const mockStartHandlerMock = jest.fn();
      const mockEndHandlerMock = jest.fn();
      addListener('MOCK_START', mockStartHandlerMock);
      addListener('MOCK_END', mockEndHandlerMock);

      mock.play().then(() => {
        expect(mockStartHandlerMock).toHaveBeenCalled();
        expect(mockEndHandlerMock).toHaveBeenCalled();
        done();
      });
    });

    it('should emit proper events on cancelled mock', (done) => {
      const serverEE = new Emitter();
      const mock = new Mock({
        emitter: serverEE,
        tasks: [
          {
            type: 'immediate',
            payload: {}
          }
        ]
      });

      const mockCancelHandlerMock = jest.fn();
      addListener('MOCK_CANCEL', mockCancelHandlerMock);

      mock.play(() => {
      }).then(
        () => {
          expect(mockCancelHandlerMock).toHaveBeenCalled();
          done();
        }
      );
      mock.cancel();
    });
  });

  describe('cancel', () => {
    it('should cancel all tasks and mock', (done) => {
      const mock = new Mock({
        emitter: new Emitter(),
        tasks: [
          {
            type: 'immediate',
            payload: {}
          }
        ]
      });

      mock.play().then(() => {
        expect(mock.tasks.every(part => part.pending === false)).toBeTruthy();
        expect(mock.pending).toBeFalsy();
        done();
      });
      mock.cancel();
    });
  });
});
