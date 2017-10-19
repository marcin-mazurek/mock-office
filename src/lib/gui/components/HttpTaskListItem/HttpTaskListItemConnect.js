import { connect } from 'react-redux';
import HttpTaskListItem from './HttpTaskListItem';
import { taskSelector } from '../../app/entities/selectors';

const TaskListItemMapStateToProps = (state, ownProps) => {
  const task = taskSelector(state, ownProps.id);
  return {
    task
  };
};

export default connect(TaskListItemMapStateToProps)(HttpTaskListItem);
