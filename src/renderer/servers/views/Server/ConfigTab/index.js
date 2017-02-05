import React from 'react';
import { Chip } from 'react-mdl';
import FilePicker from '../../../../responses/pickFile/FilePicker';
import Queue from '../../../../queues/views/Queue';

const ConfigTab = ({ serverDetails }) => {
  const { port, type, queue, id } = serverDetails;

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
        <Queue id={queue} serverId={id} />
      </div>
    </div>
  );
};

ConfigTab.propTypes = {
  serverDetails: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    port: React.PropTypes.number.isRequired,
    id: React.PropTypes.string.isRequired,
    queue: React.PropTypes.string.isRequired
  })
};

export default ConfigTab;
