import { connect } from 'react-redux';
import Modal from './Modal';

export const OVERLAY_CLICKED = 'modals/OVERLAY_CLICKED';
export const overlayClickedAction = () => ({
  type: OVERLAY_CLICKED
});
export const createModalConnect = (selectors) => {
  const mapStateToProps = state => ({
    component: selectors.modalSelector(state)
  });
  const mapDispatchToProps = {
    onOverlayClick: overlayClickedAction
  };

  return connect(mapStateToProps, mapDispatchToProps)(Modal);
};
