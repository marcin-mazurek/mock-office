import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { TASK_REMOVED, TASK_RUN } from '../../main/common/messageNames';
import { remove } from './removeTask/actions';
import { run } from './runTask/actions';

const eventArgs2ActionPayload = (event, args) => [args.serverId, args.taskId];

export default (store) => {
  Observable.fromEvent(ipcRenderer, TASK_RUN, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(run(...args)));

  Observable.fromEvent(ipcRenderer, TASK_REMOVED, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(remove(...args)));
};
