import { createModalConnect } from 'modalo';
import AddServerModal from '../AddServerModal';
import { AddBehaviourModalConnect } from '../AddBehaviourModal';

const Modal = createModalConnect({
  AddServerModal,
  AddBehaviourModal: AddBehaviourModalConnect
});

export default Modal;
