import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import StartButtonConnect from '../startServer/StartButton';
import StopButtonConnect from '../stopServer/StopButton';
import { isRunning, getSelectedServerDetails, getSelected } from '../selectors';
import FilePickerConnect from '../../tasks/addTaskFromFile/FilePicker';
import Queue from '../../queues/Queue';

export const ServerInspect = ({ running, serverDetails }) => {
  const { name, port, type, queue, id } = serverDetails;

  return (
    <div className="server">
      <div className="server-inspect">
        <header className="server-inspect__header">
          { running ? <StopButtonConnect /> : <StartButtonConnect /> } {name}
        </header>
        <main className="server-inspect-main server-inspect__main">
          <div className="server-inspect-details">
            <div className="server-inspect-details__row">
              <div className="server-inspect-details__cell">
                Port: {port}
              </div>
              <div className="server-inspect-details__cell">
                Type: {type}
              </div>
            </div>
            <div className="server-inspect-details__row">
              <div className="server-inspect-details__cell">
                <Link to="/add-task">Add task</Link>
              </div>
            </div>
            <div className="server-inspect-details__row">
              <div className="server-inspect-details__cell">
                Add from file: <FilePickerConnect />
              </div>
            </div>
          </div>
          <div className="server-inspect-queue">
            <Queue id={queue} serverId={id} />
          </div>
        </main>
      </div>
    </div>
  );
};

ServerInspect.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({})
};

const mapStateToProps = state => ({
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

const ServerInspectConnect = connect(mapStateToProps)(ServerInspect);

const Server = ({ selected }) => (
  selected ? <ServerInspectConnect /> : <div>Server is not selected</div>
);

Server.propTypes = {
  selected: React.PropTypes.string
};

const serverMapStateToProps = state => ({
  selected: getSelected(state)
});

export default connect(serverMapStateToProps)(Server);
