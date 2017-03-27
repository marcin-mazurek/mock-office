import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { SCENE_REMOVED } from '../../main/common/messageNames';
import { remove } from './removeScene/actions';

export default (store) => {
  Observable.fromEvent(
    ipcRenderer,
    SCENE_REMOVED,
    (event, args) => [args.serverId, args.sceneId]
  )
    .subscribe(args => store.dispatch(remove(...args))
    );
};
