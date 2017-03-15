import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../selectors';
import { init } from '../removeTask/actions';
import { getQueueTaskIds } from '../../queues/selectors';

export const Task = ({ id, path, serverId, remove }) =>
  <div className="task">
    <button className="task__remove-button" onClick={() => remove(serverId, id)}>
      <i className="fa fa-times" />
    </button>
    <div>{path}</div>
  </div>;

Task.propTypes = {
  id: React.PropTypes.string.isRequired,
  path: React.PropTypes.string.isRequired,
  serverId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired
};

const taskMapStateToProps = (initialState, ownProps) => state => ({
  path: getTask(state, ownProps).path
});

const taskMapDispatchToProps = {
  remove: init
};

export const TaskConnect = connect(taskMapStateToProps, taskMapDispatchToProps)(Task);

export const Tasks = ({ taskIds, serverId }) => (
  <div>
    <div className="tasks__header">
      <i className="fa fa-tasks" /> Tasks:
    </div>
    <ul className="tasks">
      {
        taskIds.map(taskId =>
          <li className="tasks__item" key={taskId}>
            <TaskConnect serverId={serverId} id={taskId} />
          </li>
        )
      }
    </ul>
  </div>
);

Tasks.propTypes = {
  taskIds: React.PropTypes.shape({}).isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  taskIds: getQueueTaskIds(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Tasks);
