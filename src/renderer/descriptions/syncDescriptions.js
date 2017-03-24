import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { DESCRIPTION_REMOVED } from '../../main/common/messageNames';
import { remove } from './removeDescription/actions';

export default (store) => {
  Observable.fromEvent(
    ipcRenderer,
    DESCRIPTION_REMOVED,
    (event, args) => [args.serverId, args.descriptionId]
  )
    .subscribe(args => store.dispatch(remove(...args))
    );
};
