import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../selectors';
import { init } from '../removeTask/actions';
import { getQueueTaskIds } from '../../queues/selectors';

export const Task = ({ id, taskPayload, queueId, remove }) =>
  <div className="task">
    <div>{JSON.stringify(taskPayload)}</div>
    <button onClick={() => remove(queueId, id)}>Remove</button>
  </div>;

Task.propTypes = {
  id: React.PropTypes.string.isRequired,
  taskPayload: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired
};

const taskMapStateToProps = (initialState, ownProps) => state => ({
  taskPayload: getTask(state, ownProps).taskPayload
});

const taskMapDispatchToProps = {
  remove: init
};

export const TaskConnect = connect(taskMapStateToProps, taskMapDispatchToProps)(Task);

export const Tasks = ({ taskIds, queueId }) => (
  <ul className="tasks">
    {
      taskIds.map(taskId =>
        <li className="tasks__item" key={taskId}>
          <TaskConnect queueId={queueId} id={taskId} />
        </li>
      )
    }
  </ul>
);

Tasks.propTypes = {
  taskIds: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  taskIds: getQueueTaskIds(ownProps.queueId, state)
});

export default connect(mapStateToProps)(Tasks);
