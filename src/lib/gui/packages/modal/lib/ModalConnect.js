import { connect } from 'react-redux';
import { overlayClickedAction } from './actions';
import { modalSelector } from './selectors';

const mapStateToProps = state => ({
  component: modalSelector(state)
});
const mapDispatchToProps = {
  onOverlayClick: overlayClickedAction
};
const createModalConnect = ModalComponent =>
  connect(mapStateToProps, mapDispatchToProps)(ModalComponent);

export default createModalConnect;
