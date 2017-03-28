import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { getTask } from '../selectors';
import { init, remove } from '../removeTask/actions';
import { getQueueTaskIds } from '../../queues/selectors';

export const Task = ({
                       id,
                       title,
                       serverId,
                       removeTask,
                       removeTaskLabel,
                       interval,
                       reuse,
                       quantity,
                       delay,
                       requirements,
                       blocking,
                       running,
                       runCount,
                       lastDuration,
                       finished
                     }) => {
  let quantityInfo = null;

  if (reuse) {
    if (reuse === 'infinite') {
      quantityInfo = <i className="fa fa-repeat" />;
    } else if (reuse === 'fixed') {
      quantityInfo = <div>{quantity} <i className="fa fa-repeat" /></div>;
    }
  }

  const taskClass = classnames('task', {
    'task--running': running,
    'task--finished': finished
  });

  return (
    <div className={taskClass}>
      <div className="task__title">{title}</div>
      <div className="task-spec">
        {
          blocking
            ? <div className="task-spec__tag"><i className="fa fa-lock" /></div>
            : null
        }
        {
          requirements
            ? <div className="task-spec__tag"><i className="fa fa-handshake-o" /></div>
            : null
        }
        {
          delay
            ? <div className="task-spec__tag"><i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}</div>
            : null
        }
        {
          interval
            ? <div className="task-spec__tag"><i className="fa fa-history" />{' '}{interval / 1000}{'s'}</div>
            : null
        }
        {
          reuse
            ? <div className="task-spec__tag">{quantityInfo}</div>
            : null
        }
        {
          runCount > 0 ?
            (
              <div className="task-status__tag" title="Run count">
                <i className="fa fa-flash" /> {runCount}
              </div>
            ) : null
        }
        {
          lastDuration ?
            (
              <div className="task-status__tag" title="Last duration">
                <i className="fa fa-clock-o" /> {lastDuration}{'ms'}
              </div>
            ) : null
        }
      </div>
      {
        finished ?
          (
            <div className="task-status__tag">
              <i className="fa fa-check" /> Finished
            </div>
          )
          : null
      }
      <button
        className="task__remove-button"
        onClick={() => (finished ? removeTaskLabel(serverId, id) : removeTask(serverId, id))}
      >
        <i className="fa fa-remove" />
      </button>
    </div>
  );
};

Task.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  serverId: React.PropTypes.string.isRequired,
  removeTask: React.PropTypes.func.isRequired,
  removeTaskLabel: React.PropTypes.func.isRequired,
  interval: React.PropTypes.number,
  reuse: React.PropTypes.string,
  quantity: React.PropTypes.number,
  delay: React.PropTypes.number,
  requirements: React.PropTypes.shape({}),
  blocking: React.PropTypes.bool,
  running: React.PropTypes.bool,
  runCount: React.PropTypes.number,
  lastDuration: React.PropTypes.number,
  finished: React.PropTypes.bool
};

const taskMapStateToProps = (initialState, ownProps) => (state) => {
  const {
    title,
    interval,
    reuse,
    quantity,
    delay,
    requirements,
    blocking,
    running,
    runCount,
    lastDuration,
    finished
  } = getTask(state, ownProps);
  return {
    title,
    interval,
    reuse,
    quantity,
    delay,
    requirements,
    blocking,
    running,
    runCount,
    lastDuration,
    finished
  };
};

const taskMapDispatchToProps = {
  removeTask: init,
  removeTaskLabel: remove
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
