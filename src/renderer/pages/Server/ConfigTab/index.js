import React from 'react';
import { Chip } from 'react-mdl';
import FilePicker from '../../../expectations/addFromFile/FilePicker';
import HttpUnloadedExpectationList from '../HttpUnloadedExpectationList';
import WsUnloadedExpectationList from '../WsUnloadedExpectationList';

const ConfigTab = ({ serverDetails }) => {
  const { port, type } = serverDetails;

  return (
    <div className="server-config-tab">
      <div className="server-config-tab-details">
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
            <h2>Queues placeholder</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfigTab.propTypes = {
  serverDetails: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    port: React.PropTypes.number.isRequired
  })
};

export default ConfigTab;
