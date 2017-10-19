import { createModalConnect } from 'modalo';
import AddServerModal from '../AddServerModal';
import { AddMockModalConnect } from '../AddMockModal';

const Modal = createModalConnect({
  AddServerModal,
  AddMockModal: AddMockModalConnect
});

export default Modal;
