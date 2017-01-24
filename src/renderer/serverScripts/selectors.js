import { createSelector } from 'reselect';
import { getSelected } from '../servers/selectors';

const getAll = state => state.getIn(['serverScripts', 'itemsById']);
const getScriptsByServer = state => state.getIn(['serverScripts', 'itemsByServer']);

export const getSelectedServerScripts = createSelector(
  getSelected,
  getScriptsByServer,
  getAll,
  (server, scriptsByServer, allScripts) => scriptsByServer
    .get(server)
    .toList()
    .map(id => allScripts.get(id))
);

export const getRunning = state => state.getIn(['serverScripts', 'running']);
