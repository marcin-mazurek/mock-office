import { createModalConnect, createModal } from '../../packages/modal';
import AddServerModal from '../AddServerModal';
import { AddBehaviourModalConnect } from '../AddBehaviourModal';

export default createModalConnect(createModal({
  AddServerModal,
  AddBehaviourModal: AddBehaviourModalConnect
}));
