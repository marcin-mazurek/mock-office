import { connect } from 'react-redux';
import { mockSelector } from '../../app/entities';
import { removeButtonClickedAction } from './actions';
import WsMockListItem from './WsMockListItem';

const mockMapStateToProps = (state, ownProps) => {
  const mock = mockSelector(state, ownProps.id);

  return {
    mock
  };
};

const mockMapDispatchToProps = {
  onRemoveButtonClick: removeButtonClickedAction
};
export default connect(mockMapStateToProps, mockMapDispatchToProps)(WsMockListItem);
