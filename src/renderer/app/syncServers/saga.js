import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { push } from 'react-router-redux';
import { add, start } from '../../servers/actions';
import { addQueue, addResponse as addResponseToQueue } from '../../queues/actions';
import { add as addResponse } from '../../responses/actions';

export default function* syncServers() {
  const serversApi = remote.require('./main/servers').default;
  const servers = serversApi.getAll();

  for (let i = 0; i < servers.length; i += 1) {
    const server = servers[i];
    yield put(add(server.name, server.port, server.type, server.id, server.queueId));
    yield put(addQueue(server.queueId));

    if (server.isLive()) {
      yield put(start(server.id));
    }
  }

  yield put(push('/'));

  const queuesApi = remote.require('./main/queues').default;
  const queues = queuesApi.getAll();

  for (let i = 0; i < queues.length; i += 1) {
    const queue = queues[i];
    const responses = queue.responses;

    for (let responseIndex = 0; responseIndex < responses.length; responseIndex += 1) {
      const response = responses[responseIndex];
      yield put(addResponse(response, response.id));
      yield put(addResponseToQueue(queue.id, response.id));
    }
  }
}
