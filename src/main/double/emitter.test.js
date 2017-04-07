import { DoubleEmitter, addListener } from './emitter';

describe('DoubleEmitter', () => {
  it('should initialize params object', () => {
    const serverEE = new DoubleEmitter(null);
    expect(serverEE.params).toEqual({});
    const serverEEWithDefaultParams = new DoubleEmitter({ param: 'value' });
    expect(serverEEWithDefaultParams.params).toEqual({ param: 'value' });
  });

  describe('extend', () => {
    it('should pass params to new emitter', () => {
      const serverEE = new DoubleEmitter({ param: 'param value' });
      const extendedEE = serverEE.extend();
      expect(extendedEE.params).toEqual({
        param: 'param value'
      });
    });

    it('should pass extra params to new emitter', () => {
      const serverEE = new DoubleEmitter({ param: 'param value' });
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
      const serverEE = new DoubleEmitter({ param: 'param value' });
      serverEE.emit('event');
      expect(eventHandlerMock).toHaveBeenCalled();
      expect(eventHandlerMock).toHaveBeenCalledWith({ param: 'param value' });
    });
  });

  describe('emit', () => {
    it('should emit event with its params', () => {
      const eventHandlerMock = jest.fn();
      addListener('event', eventHandlerMock);
      const serverEE = new DoubleEmitter({ param: 'param value' });
      serverEE.emit('event');
      expect(eventHandlerMock).toHaveBeenCalled();
      expect(eventHandlerMock).toHaveBeenCalledWith({ param: 'param value' });
    });
  });
});
