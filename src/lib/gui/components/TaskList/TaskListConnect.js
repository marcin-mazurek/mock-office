import { connect } from 'react-redux';
import { behaviourSelector } from '../../app/entities';
import TaskList from './TaskList';

const mapStateToProps = (state, ownProps) => ({
  tasks: behaviourSelector(state, ownProps.behaviour).get('tasks')
});

export default connect(mapStateToProps)(TaskList);
