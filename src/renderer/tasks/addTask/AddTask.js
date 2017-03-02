import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../servers/selectors';
import Http from './HttpForm';
import Ws from './WsForm';

export const AddTask = ({ serverType }) => (
  <div className="add-task">
    <Link to="/">&#8666; Server details</Link>
    {
      serverType === 'http'
        ? <Http />
        : <Ws />
    }
  </div>
);

AddTask.propTypes = {
  serverType: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddTask);
