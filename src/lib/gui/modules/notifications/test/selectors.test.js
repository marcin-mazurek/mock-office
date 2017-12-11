import { allNotificationsSelector } from '../lib/selectors';

test('allNotificationsSelector', () => {
  const state = { notifications: { ids: ['id'], entities: { id: { id: 'id', message: 'message', disposable: false } } } };
  expect(allNotificationsSelector(state)).toEqual(
    [{ id: 'id', message: 'message', disposable: false }]
  );
});
