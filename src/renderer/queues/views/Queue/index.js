import React from 'react';
import { connect } from 'react-redux';
import { getQueueTasks } from '../../selectors';
import Tasks from '../../../tasks/views/Tasks';

const Queue = ({ tasks, id }) => (
  <div className="queue">
    <div className="queue__tasks">
      <Tasks tasksIds={tasks} queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  tasks: React.PropTypes.shape().isRequired,
  id: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  tasks: getQueueTasks(ownProps.id, state)
});

export default connect(mapStateToProps)(Queue);
