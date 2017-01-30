import React from 'react';
import { Chip } from 'react-mdl';
import FilePicker from '../../../../queues/addFromFile/FilePicker';
import Queues from '../Queues';

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
      <div className="server-config-tab__expectations server-config-tab-queues">
        <Queues />
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
