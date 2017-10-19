import { connect } from 'react-redux';
import ServerViewHeader from './ServerViewHeader';
import {
  removeButtonClickedAction,
  addMockButtonClickedAction
} from './actions';

const serverMapDispatchToProps = {
  onRemoveButtonClick: removeButtonClickedAction,
  onAddMockButtonClickedAction: addMockButtonClickedAction
};

export default connect(null, serverMapDispatchToProps)(ServerViewHeader);
