import { connect } from 'react-redux';
import { overlayClickedAction } from './actions';
import { modalSelector } from '../../app/modal/selectors';
import createModal from './Modal';
import AddServerModal from '../AddServerModal';
import AddMockModal from '../AddMockModal';

const mapStateToProps = state => ({
  component: modalSelector(state)
});
const mapDispatchToProps = {
  onOverlayClick: overlayClickedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(createModal({
  AddServerModal,
  AddMockModal
}));
