import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { SCENE_REMOVED, SCENE_RUN, SCENE_STOPPED } from '../../main/common/messageNames';
import { remove, finish } from './removeScene/actions';
import { run, stop } from './runScene/actions';

const eventArgs2ActionPayload = (event, args) => [args.serverId, args.taskId];

export default (store) => {
  Observable.fromEvent(
    ipcRenderer,
    SCENE_REMOVED,
    (event, args) => [args.serverId, args.sceneId]
  )
    .subscribe(args => store.dispatch(remove(...args))
    );

  Observable.fromEvent(ipcRenderer, SCENE_STOPPED, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(stop(...args)));

  Observable.fromEvent(ipcRenderer, SCENE_REMOVED, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(finish(...args)));
};
