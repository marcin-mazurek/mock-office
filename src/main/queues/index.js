import unique from 'node-unique';
import { EventEmitter } from 'events';
import Queue from './Queue';

export const events = {
  TASK_REMOVED_AFTER_USE: 'TASK_REMOVED_AFTER_USE'
};

export const emitter = new EventEmitter();
const queues = [];

const createQueue = serverId => new Queue({
  id: unique(),
  serverId,
  emitter
});

const addQueue = (serverId) => {
  const q = createQueue(serverId);
  queues.push(q);

  return q.id;
};

const getQueue = id => queues.find(q => q.id === id);

const removeTask = (queueId, taskId) => {
  getQueue(queueId).removeTask(taskId);
  emitter.emit(events.TASK_REMOVED, queueId);
};

const runReadyTasks = (queueId, requirements, cb) => {
  getQueue(queueId).runReadyTasks(requirements, cb);
};

const addTask = (queueId, task) => getQueue(queueId).addTask(task);
const getAll = () => queues;

const cancelPendingTasks = (queueId) => {
  getQueue(queueId).cancelPendingTasks();
};

const openTunnel = (queueId, tunnel) => {
  getQueue(queueId).openTunnel(tunnel);
};

const closeTunnel = (queueId) => {
  getQueue(queueId).closeTunnel();
};

export default {
  addQueue,
  getQueue,
  addTask,
  runReadyTasks,
  getAll,
  removeTask,
  cancelPendingTasks,
  openTunnel,
  closeTunnel
};
