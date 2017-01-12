import React from 'react';
import { connect } from 'react-redux';
import ConfigTab from '../ConfigTab';
import { isRunning, getSelectedServerDetails } from '../../../servers/selectors';

const ServerPanel = ({ running, serverDetails }) => {
  const { name } = serverDetails;

  return (
    <div className="server-panel">
      <header className="server-panel__header mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">
            {name}
          </span>
        </div>
      </header>
      <main className="server-panel__main">
        <ConfigTab {...{ running, serverDetails }} />
      </main>
    </div>
  );
};

ServerPanel.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    port: React.PropTypes.number.isRequired
  })
};

const mapStateToProps = state => ({
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

export default connect(mapStateToProps)(ServerPanel);
