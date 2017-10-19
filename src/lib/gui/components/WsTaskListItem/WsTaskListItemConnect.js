import { connect } from 'react-redux';
import WsTaskListItem from './WsTaskListItem';
import { taskSelector } from '../../app/entities/selectors';

const WsTaskListItemMapStateToProps = (state, ownProps) => {
  const task = taskSelector(state, ownProps.id);
  return {
    task
  };
};

export default connect(WsTaskListItemMapStateToProps)(WsTaskListItem);
