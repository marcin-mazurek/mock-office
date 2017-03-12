import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { TASK_REMOVED } from '../../main/common/messageNames';
import { remove } from './removeTask/actions';

export default (store) => {
  Observable.fromEvent(
    ipcRenderer,
    TASK_REMOVED,
    (event, args) => [args.serverId, args.taskId]
  )
    .subscribe(args => store.dispatch(remove(...args))
    );
};
