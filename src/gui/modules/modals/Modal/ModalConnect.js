import { connect } from 'react-redux';

export const OVERLAY_CLICKED = 'modals/OVERLAY_CLICKED';
export const overlayClickedAction = () => ({
  type: OVERLAY_CLICKED
});
export const createModalConnect = (Modal, selectors) => {
  const mapStateToProps = state => ({
    component: selectors.modalSelector(state)
  });
  const mapDispatchToProps = {
    onOverlayClick: overlayClickedAction
  };

  return connect(mapStateToProps, mapDispatchToProps)(Modal);
};
