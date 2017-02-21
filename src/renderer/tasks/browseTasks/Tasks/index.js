import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../../selectors';
import { init } from '../../removeTask/actions';
import { getQueueTaskIds } from '../../../queues/selectors';

const Tasks = ({ tasks, queueId, remove }) => (
  <ul className="tasks">
    {
      tasks.map(task => (
        <li className="tasks__item" key={task.id}>
          <div className="task">
            <div>{JSON.stringify(task.taskPayload)}</div>
            <button onClick={() => remove(queueId, task.id)}>Remove</button>
          </div>
        </li>
      ))
    }
  </ul>
);

Tasks.propTypes = {
  tasks: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  tasks: getQueueTaskIds(ownProps.queueId, state).map(taskId => getTask(state, taskId))
});

const mapDispatchToProps = {
  remove: init
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
