import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../../selectors';
import { init } from '../../remove/actions';

const TaskComponent = ({ task, remove, queueId, taskId }) => (
  <div className="task">
    <div>{JSON.stringify(task)}</div>
    <button onClick={() => remove(queueId, taskId)}>Remove</button>
  </div>
);

TaskComponent.propTypes = {
  taskId: React.PropTypes.string.isRequired,
  task: React.PropTypes.shape({}).isRequired,
  remove: React.PropTypes.func.isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  task: getTask(state, ownProps.taskId)
});

const mapDispatchToProps = {
  remove: init
};

const Task = connect(mapStateToProps, mapDispatchToProps)(TaskComponent);

const Tasks = ({ tasksIds, queueId }) => (
  <ul className="tasks">
    {
      tasksIds.map(id => (
        <li className="tasks__item" key={id}>
          <Task taskId={id} queueId={queueId} />
        </li>
      ))
    }
  </ul>
);

Tasks.propTypes = {
  tasksIds: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired
};

export default Tasks;
