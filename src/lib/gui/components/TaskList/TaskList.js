import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { HttpTaskListItemConnect } from '../HttpTaskListItem';

const TaskList = ({ tasks, render }) => (
  <ul className="task-list">
    {
      tasks.map(task =>
        <li className="task-list__item" key={task}>
          {render(task)}
        </li>
      )
    }
  </ul>
);

TaskList.propTypes = {
  tasks: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  render: PropTypes.func.isRequired
};

export default TaskList;
