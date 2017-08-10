import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { mockSelector, taskSelector } from '../../app/entities';
import expandIcon from '../../assets/icons_green_expand@3x.svg';

export const TaskListItem = ({
                               title,
                               interval,
                               reuse,
                               quantity,
                               delay
                             }) => {
  let quantityInfo = null;

  if (reuse) {
    if (reuse === 'infinite') {
      quantityInfo = <i className="fa fa-repeat" />;
    } else if (reuse === 'fixed') {
      quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
    }
  }
  return (
    <div className="task-list-item">
      <button className="task-expand-button">
        <img src={expandIcon} role="presentation" />
      </button>
      <div className="task-list-item-title">{title}</div>
      <div className="task-list-item-spec">
        {
          delay
            ? (
              <div className="task-list-item-spec__tag">
                <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          interval
            ? (
              <div className="task-list-item-spec__tag">
                <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          reuse
            ? <div className="task-list-item-spec__tag">{quantityInfo}</div>
            : null
        }
      </div>
    </div>
  );
};

TaskListItem.propTypes = {
  title: PropTypes.string.isRequired,
  interval: PropTypes.number,
  reuse: PropTypes.bool,
  quantity: PropTypes.number,
  delay: PropTypes.number
};

const TaskListItemMapStateToProps = (state, ownProps) => {
  const task = taskSelector(state, ownProps.id);
  return {
    title: task.title,
    interval: task.interval,
    reuse: task.reuse,
    quantity: task.quantity,
    delay: task.delay,
  };
};

export const TaskListItemConnect =
  connect(TaskListItemMapStateToProps)(TaskListItem);

export const TaskList = ({ tasks }) => (
  <ul className="task-list">
    {
      tasks.map(task =>
        <li className="task-list__item" key={task}>
          <TaskListItemConnect id={task} />
        </li>
      )
    }
  </ul>
);

TaskList.propTypes = {
  tasks: ImmutablePropTypes.listOf(PropTypes.string)
};

const mapStateToProps = (state, ownProps) => ({
  tasks: mockSelector(state, ownProps.mock).tasks
});

export default connect(mapStateToProps)(TaskList);
