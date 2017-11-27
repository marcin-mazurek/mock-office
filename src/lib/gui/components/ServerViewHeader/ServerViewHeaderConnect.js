import { connect } from 'react-redux';
import ServerViewHeader from './ServerViewHeader';
import {
  removeButtonClickedAction,
  addBehaviourButtonClickedAction
} from './actions';

const serverMapDispatchToProps = {
  onRemoveButtonClick: removeButtonClickedAction,
  onAddBehaviourButtonClickedAction: addBehaviourButtonClickedAction
};

export default connect(null, serverMapDispatchToProps)(ServerViewHeader);
