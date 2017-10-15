import { connect } from 'react-redux';
import { mockSelector } from '../../app/entities';
import { removeButtonClickedAction } from './actions';
import MockListItem from './MockListItem';

const mockMapStateToProps = (state, ownProps) => {
  const mock = mockSelector(state, ownProps.id);

  return {
    id: mock.id,
    title: mock.title,
    reuse: mock.reuse,
    quantity: mock.quantity,
    requirements: mock.requirements,
    runCount: mock.runCount,
    lastDuration: mock.lastDuration,
    finished: mock.finished,
    running: mock.running,
    tasks: mock.tasks
  };
};

const mockMapDispatchToProps = {
  onRemoveButtonClick: removeButtonClickedAction
};
export default connect(mockMapStateToProps, mockMapDispatchToProps)(MockListItem);
