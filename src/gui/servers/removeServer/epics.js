import { Observable } from 'rxjs';
import { push } from 'react-router-redux';
import { INIT } from './actions';
import { remove } from '../../entities/servers/actions';
import getCurrentDisplayedServerId from '../../sidebar/selectors';
import { remove as removeMock } from '../../entities/mocks/actions';
import { mockSelector } from '../../entities/mocks/selectors';

export default (action$, store) =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-server', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: action.id })
      })
        .then(() => action.id)
    ))
    .flatMap((id) => {
      const actions = [];

      // Change route to prevent errors when trying to display removed server
      const state = store.getState();
      const displayedServerId = getCurrentDisplayedServerId(state);
      if (displayedServerId === id) {
        actions.push(push('/'));
      }
      actions.push(remove(id));
      const server = state.getIn(['servers', 'entities', id]);
      server.get('mocks').forEach((mockId) => {
        actions.push(removeMock(id, mockId));
        const mock = mockSelector(mockId);
        //mock.get('tasks').forEach(taskId => actions.push(removeTask(taskId)));
      });

      return Observable.from(actions);
    });
