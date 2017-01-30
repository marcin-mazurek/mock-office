import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { push } from 'react-router-redux';
import { add, addQueue as addQueueToServer } from '../../servers/actions';
import { addQueue, addResponse as addResponseToQueue } from '../../queues/actions';
import { add as addResponse } from '../../responses/actions';

export default function* syncServers() {
  const serversApi = remote.require('./dist/main/servers').default;
  const serversMap = serversApi.getAll();
  const serverIds = Object.keys(serversMap);

  for (let i = 0; i < serverIds.length; i += 1) {
    const serverId = serverIds[i];
    const server = serversMap[serverId];
    yield put(add(server.name, server.port, server.type, server.id));
  }

  yield put(push('/'));

  const queuesApi = remote.require('./dist/main/queues').default;
  const queues = queuesApi.getAll();

  for (let i = 0; i < queues.length; i += 1) {
    const queue = queues[i];
    yield put(addQueue(queue.id, queue.request));
    yield put(addQueueToServer(queue.server, queue.id));

    const responses = queue.responses;

    for (let responseIndex = 0; i < responses.length; i += 1) {
      const response = responses[responseIndex];
      yield put(addResponse(response, response.id));
      yield put(addResponseToQueue(queue.id, response.id));
    }
  }
}
