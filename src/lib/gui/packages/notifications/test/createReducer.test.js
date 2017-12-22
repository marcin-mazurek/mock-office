describe('createReducer', () => {
  test('removeNotification', () => {
    jest.doMock('cuid', () => () => 'id');
    const { removeNotification } = require('../lib/createReducer');

    const state = removeNotification(
      { ids: ['id'], entities: { id: { id: 'id', message: 'message' } } },
      'id'
    );
    expect(state).toEqual({ ids: [], entities: {} });
  });

  test('addNotification', () => {
    const { addNotification } = require('../lib/createReducer');
    const state = addNotification(
      { ids: [], entities: {} },
      { message: 'message', disposable: false }
    );
    expect(state).toEqual({ ids: ['id'], entities: { id: { id: 'id', message: 'message', disposable: false } } });
  });
});
