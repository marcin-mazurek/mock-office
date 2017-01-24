import React from 'react';
import { Chip } from 'react-mdl';
import FilePicker from '../../../expectations/addFromFile/FilePicker';
import HttpLoadedExpectationList from '../HttpLoadedExpectationList';
import HttpUnloadedExpectationList from '../HttpUnloadedExpectationList';
import WsLoadedExpectationList from '../WsLoadedExpectationList';
import WsUnloadedExpectationList from '../WsUnloadedExpectationList';
import StartButton from '../../../servers/startServer/StartButton';
import StopButton from '../../../servers/stopServer/StopButton';

const ConfigTab = ({ running, serverDetails }) => {
  const { port, type } = serverDetails;

  return (
    <div>
      <div className="server-config-tab">
        <div className="server-config-tab-details__row">
          <div className="server-config-tab-details__cell">
            <Chip>
              Port: {port}
            </Chip>
          </div>
          <div className="server-config-tab-details__cell">
            <Chip>
              Type: {type}
            </Chip>
          </div>
        </div>
        <div className="server-config-tab-details__row">
          <div className="server-config-tab-details__cell">
            { running ? <StopButton /> : <StartButton /> }
          </div>
          <div className="server-config-tab-details__cell">
            <FilePicker />
          </div>
        </div>
      </div>
      <div className="server-config-tab__expectations server-config-tab-expectations">
        <div className="server-config-tab-expectations-type server-config-tab-expectations__type">
          <span>Not loaded:</span>
          <div className="server-config-tab-expectations-type__list">
            { type === 'http' ? <HttpUnloadedExpectationList /> : null }
            { type === 'ws' ? <WsUnloadedExpectationList /> : null }
          </div>
        </div>
        <div className="server-config-tab-expectations-type server-config-tab-expectations__type">
          <span>Loaded:</span>
          <div className="server-config-tab-expectations-type__list">
            { type === 'http' ? <HttpLoadedExpectationList /> : null }
            { type === 'ws' ? <WsLoadedExpectationList /> : null }
          </div>
        </div>
      </div>
    </div>
  );
};

ConfigTab.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    port: React.PropTypes.number.isRequired
  })
};

export default ConfigTab;
