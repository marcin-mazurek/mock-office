import { Observable } from 'rxjs';
import { ifElse } from 'ramda';
import { SWITCH_BUTTON_CLICKED } from '../inspectServer/InspectServer';
import startServer from '../startServer/startServer';
import stopServer from '../stopServer/stopServer';

const isOn = action => action.isOn;
const onServerOn = action => stopServer(Observable.from([action]));
const onServerOff = action => startServer(Observable.from([action]));

export default action$ =>
  action$.ofType(SWITCH_BUTTON_CLICKED)
    .flatMap(
      action => ifElse(
        isOn,
        onServerOn,
        onServerOff
      )(action)
    );
