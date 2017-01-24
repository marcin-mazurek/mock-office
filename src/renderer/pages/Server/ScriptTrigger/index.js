import React from 'react';
import { connect } from 'react-redux';
import { init } from '../../../serverScripts/runScript/actions';
import { getRunning } from '../../../serverScripts/selectors';

const ScriptTrigger = ({ script, server, run, running }) => (
  <div>
    <div>{script.name}</div>
    {
      running
        ? 'Running!'
        : <button onClick={() => run(server, script)}>Load</button>
    }
  </div>
);

ScriptTrigger.propTypes = {
  script: React.PropTypes.shape({}),
  server: React.PropTypes.string.isRequired,
  run: React.PropTypes.func.isRequired,
  running: React.PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const runningScripts = getRunning(state);
  const running = runningScripts.has(ownProps.script.id);

  return {
    running
  };
};

const mapDispatchToProps = {
  run: init
};

export default connect(mapStateToProps, mapDispatchToProps)(ScriptTrigger);
