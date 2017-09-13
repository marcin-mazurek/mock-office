import { Emitter, addListener } from './emitter';

describe('Emitter', () => {
  it('should initialize params object', () => {
    const serverEE = new Emitter(null);
    expect(serverEE.params).toEqual({});
    const serverEEWithDefaultParams = new Emitter({ param: 'value' });
    expect(serverEEWithDefaultParams.params).toEqual({ param: 'value' });
  });

  describe('extend', () => {
    it('should pass params to new emitter', () => {
      const serverEE = new Emitter({ param: 'param value' });
      const extendedEE = serverEE.extend();
      expect(extendedEE.params).toEqual({
        param: 'param value'
      });
    });

    it('should pass extra params to new emitter', () => {
      const serverEE = new Emitter({ param: 'param value' });
      const extendedEE = serverEE.extend({
        extraParam: 'extra param value'
      });
      expect(extendedEE.params).toEqual({
        param: 'param value',
        extraParam: 'extra param value'
      });
    });
  });

  describe('emit', () => {
    it('should emit event with its params', () => {
      const eventHandlerMock = jest.fn();
      addListener('event', eventHandlerMock);
      const serverEE = new Emitter({ param: 'param value' });
      serverEE.emit('event');
      expect(eventHandlerMock).toHaveBeenCalled();
      expect(eventHandlerMock).toHaveBeenCalledWith({ param: 'param value' });
    });
  });

  describe('emit', () => {
    it('should emit event with its params', () => {
      const eventHandlerMock = jest.fn();
      addListener('event', eventHandlerMock);
      const serverEE = new Emitter({ param: 'param value' });
      serverEE.emit('event');
      expect(eventHandlerMock).toHaveBeenCalled();
      expect(eventHandlerMock).toHaveBeenCalledWith({ param: 'param value' });
    });
  });
});
