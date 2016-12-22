import React from 'react';
import { connect } from 'react-redux';
import FilePicker from '../../mocks/addFromFile/FilePicker';
import Expectations from '../Expectations';
import {
  requestStart as dispatchRequestStart,
  requestStop as dispatchRequestStop
} from '../../servers/actions';
import { getSelected, isRunning } from '../../servers/selectors';

const Server = ({ requestStart, requestStop, id, running }) => (
  <div className="server">
    <FilePicker />
    <Expectations />
    <button
      onClick={() => {
        if (running) {
          requestStop(id);
        } else {
          requestStart(id);
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
  requestStart: dispatchRequestStart,
  requestStop: dispatchRequestStop
};

Server.propTypes = {
  id: React.PropTypes.string.isRequired,
  requestStart: React.PropTypes.func.isRequired,
  requestStop: React.PropTypes.func.isRequired,
  running: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Server);
