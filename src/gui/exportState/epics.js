import { EXPORT_BUTTON_CLICKED } from '../sidebar/SidebarServers/SideBarServers';

const SUCCEEDED = 'export/SUCCEEDED';
const succeedAction = () => ({ type: SUCCEEDED });

export default action$ =>
  action$.ofType(EXPORT_BUTTON_CLICKED)
    .map(() => {
      window.location = 'http://127.0.0.1:3060/export';
      return true;
    })
    .mapTo(succeedAction());
