import { createModalConnect } from 'modalo';
import AddServerModal from '../AddServerModal';
import AddMockModal from '../AddMockModal';

const Modal = createModalConnect({
  AddServerModal,
  AddMockModal
});

export default Modal;
