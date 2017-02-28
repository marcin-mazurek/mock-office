import React from 'react';
import { connect } from 'react-redux';
import { Chip } from 'react-mdl';
import { Link } from 'react-router';
import StartButtonConnect from '../startServer/StartButton';
import StopButtonConnect from '../stopServer/StopButton';
import { isRunning, getSelectedServerDetails } from '../selectors';
import FilePickerConnect from '../../tasks/addTaskFromFile/FilePicker';
import Queue from '../../queues/Queue';

export const Server = ({ running, serverDetails }) => {
  const { name, port, type, queue, id } = serverDetails;

  return (
    <div className="server-page">
      <div className="server-panel">
        <header className="server-panel__header mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">
              { running ? <StopButtonConnect /> : <StartButtonConnect /> } {name}
            </span>
          </div>
        </header>
        <main className="server-panel-main server-panel__main">
          <div className="server-panel__tab">
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
                    <Link to="/add-task">Add task</Link>
                  </div>
                </div>
                <div className="server-config-tab-details__row">
                  <div className="server-config-tab-details__cell">
                    Add from file: <FilePickerConnect />
                  </div>
                </div>
              </div>
              <div className="server-config-tab__tasks server-config-tab-queues">
                <Queue id={queue} serverId={id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

Server.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({})
};

const mapStateToProps = state => ({
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

export default connect(mapStateToProps)(Server);
