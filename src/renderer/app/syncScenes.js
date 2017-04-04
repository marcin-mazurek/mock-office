import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import {
  SCENE_START,
  SCENE_STOP,
  SCENE_REMOVED_AFTER_USE,
  SCENE_END
} from '../../main/common/eventNames';
import { removeAfterUse, finish } from '../scenes/removeScene/actions';
import { run, stop } from '../scenes/runScene/actions';

const eventArgs2ActionPayload = (event, args) => [args.serverId, args.sceneId];

export default (store) => {
  Observable.fromEvent(ipcRenderer, SCENE_STOP, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(stop(...args)));

  Observable.fromEvent(ipcRenderer, SCENE_END, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(finish(...args)));

  Observable.fromEvent(ipcRenderer, SCENE_REMOVED_AFTER_USE, eventArgs2ActionPayload)
    .delay(5000)
    .subscribe(args => store.dispatch(removeAfterUse(...args)));

  Observable.fromEvent(ipcRenderer, SCENE_START, eventArgs2ActionPayload)
    .subscribe(args => store.dispatch(run(...args)));
};
