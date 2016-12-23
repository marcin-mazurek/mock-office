import React from 'react';
import { connect } from 'react-redux';
import FilePicker from '../../mocks/addFromFile/FilePicker';
import Expectations from '../Expectations';
import initServerStop from '../../servers/stopServer/actions';
import initServerStart from '../../servers/startServer/actions';
import { getSelected, isRunning } from '../../servers/selectors';

const Server = ({ start, stop, id, running }) => (
  <div className="server">
    <FilePicker />
    <Expectations />
    <button
      onClick={() => {
        if (running) {
          stop(id);
        } else {
          start(id);
        }
      }}
    >
      { running ? 'Stop' : 'Start' }
    </button>
  </div>
);

const mapStateToProps = state => ({
  id: getSelected(state),
  running: isRunning(state)
});

const mapDispatchToProps = {
  start: initServerStart,
  stop: initServerStop
};

Server.propTypes = {
  id: React.PropTypes.string.isRequired,
  start: React.PropTypes.func.isRequired,
  stop: React.PropTypes.func.isRequired,
  running: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Server);
