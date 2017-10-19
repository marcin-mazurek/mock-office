import { connect } from 'react-redux';
import { mockSelector } from '../../app/entities';
import TaskList from './TaskList';

const mapStateToProps = (state, ownProps) => ({
  tasks: mockSelector(state, ownProps.mock).get('tasks')
});

export default connect(mapStateToProps)(TaskList);
