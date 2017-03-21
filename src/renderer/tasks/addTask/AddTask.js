import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../servers/selectors';
import Http from './HttpForm';
import Ws from './WsForm';

export const AddTask = ({ serverType }) => (
  <div className="add-task">
    <div className="view-header">
      Add task
    </div>
    <div className="add-task__main">
      <Link to="/" className="add-task__back-button">
        <i className="fa fa-arrow-left" />{' Server details'}
      </Link>
      {
        serverType === 'http'
          ? <Http />
          : <Ws />
      }
    </div>
  </div>
);

AddTask.propTypes = {
  serverType: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddTask);
