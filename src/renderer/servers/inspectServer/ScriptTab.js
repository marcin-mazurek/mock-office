import React from 'react';
import { connect } from 'react-redux';
import { getSelectedServerScripts } from '../../serverScripts/selectors';
import { getSelected } from '../selectors';
import ScriptPicker from '../../serverScripts/addFromFile/FilePicker';
import ScriptTrigger from './ScriptTrigger';

const ScriptTab = ({ scripts, server }) => (
  <div className="server-script-tab">
    <ScriptPicker />
    <div>
      <h3>scripts:</h3>
      <ul>
        {
          scripts.map(script => (
            <li key={script.id}>
              <ScriptTrigger script={script} server={server} />
            </li>
          ))
        }
      </ul>
    </div>
  </div>
);

ScriptTab.propTypes = {
  scripts: React.PropTypes.shape({}),
  server: React.PropTypes.string
};

const mapStateToProps = state => ({
  server: getSelected(state),
  scripts: getSelectedServerScripts(state)
});

export default connect(mapStateToProps)(ScriptTab);
