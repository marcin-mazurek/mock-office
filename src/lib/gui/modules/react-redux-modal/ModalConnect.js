import { connect } from 'react-redux';
import { overlayClickedAction } from './actions';
import { modalSelector } from './selectors';
import createModal from './Modal';

const mapStateToProps = state => ({
  component: modalSelector(state)
});
const mapDispatchToProps = {
  onOverlayClick: overlayClickedAction
};
const createModalConnect = types =>
  connect(mapStateToProps, mapDispatchToProps)(createModal(types));

export default createModalConnect;
