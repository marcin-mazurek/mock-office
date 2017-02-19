import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../../servers/selectors';
import Http from './httpForm';
import Ws from './wsForm';

const AddTaskForm = ({ serverType }) => (
  <div className="add-task">
    <Link to="/server">&#8666; Server details</Link>
    {
      serverType === 'http'
        ? <Http />
        : <Ws />
    }
  </div>
);

AddTaskForm.propTypes = {
  serverType: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddTaskForm);
