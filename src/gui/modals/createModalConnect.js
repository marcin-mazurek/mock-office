import { connect } from 'react-redux';
import { Modal, overlayClickedAction } from './Modal';

const createModalConnect = (selectors) => {
  const mapStateToProps = state => ({
    component: selectors.modalSelector(state)
  });
  const mapDispatchToProps = {
    onOverlayClick: overlayClickedAction
  };

  return connect(mapStateToProps, mapDispatchToProps)(Modal);
};

export default createModalConnect;
