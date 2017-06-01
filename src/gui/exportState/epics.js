import { EXPORT_BUTTON_CLICKED } from '../sidebar/SideBarServers';

const SUCCEED = 'export/SUCCEED';
const succeedAction = () => ({ type: SUCCEED });

export default action$ =>
  action$.ofType(EXPORT_BUTTON_CLICKED)
    .map(() => {
      window.location = 'http://127.0.0.1:3060/export';
      return true;
    })
    .mapTo(succeedAction());
