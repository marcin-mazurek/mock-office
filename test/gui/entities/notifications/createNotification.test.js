import createNotification from '../../../../src/gui/entities/notifications/createNotification';

describe('createNotification', () => {
  it('should not pass notification type if it is not valid', () => {
    expect(createNotification({ type: 'unknown type' }).toJS().type).toEqual('info');
    expect(createNotification({}).toJS().type).toEqual('info');
    expect(createNotification({ type: 'info' }).toJS().type).toEqual('info');
    expect(createNotification({ type: 'error' }).toJS().type).toEqual('error');
  });

  it('should throw if param object is not provided', () => {
    expect(() => { createNotification(); }).toThrow();
  });
});
