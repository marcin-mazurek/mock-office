import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../selectors';
import { init } from '../removeTask/actions';
import { getQueueTaskIds } from '../../queues/selectors';

export const Task = ({ id, taskPayload, serverId, remove }) =>
  <div className="task">
    <div>{JSON.stringify(taskPayload)}</div>
    <button className="button" onClick={() => remove(serverId, id)}>
      <i className="fa fa-times" />
    </button>
  </div>;

Task.propTypes = {
  id: React.PropTypes.string.isRequired,
  taskPayload: React.PropTypes.shape({}).isRequired,
  serverId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired
};

const taskMapStateToProps = (initialState, ownProps) => state => ({
  taskPayload: getTask(state, ownProps).taskPayload
});

const taskMapDispatchToProps = {
  remove: init
};

export const TaskConnect = connect(taskMapStateToProps, taskMapDispatchToProps)(Task);

export const Tasks = ({ taskIds, serverId }) => (
  <ul className="tasks">
    {
      taskIds.map(taskId =>
        <li className="tasks__item" key={taskId}>
          <TaskConnect serverId={serverId} id={taskId} />
        </li>
      )
    }
  </ul>
);

Tasks.propTypes = {
  taskIds: React.PropTypes.shape({}).isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  taskIds: getQueueTaskIds(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Tasks);
