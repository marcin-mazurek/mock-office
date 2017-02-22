import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { TASK_REMOVED } from '../../../main/common/messageNames';
import { remove } from '../removeTask/actions';

export default (store) => {
  Observable.bindCallback(
    ipcRenderer.on.bind(ipcRenderer),
    (event, args) => [args.queueId, args.taskId]
  )(TASK_REMOVED)
    .subscribe(args => store.dispatch(remove(...args))
    );
};
