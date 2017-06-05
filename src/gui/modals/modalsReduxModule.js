import { Map } from 'immutable';
import createReduxModule from '../utils/createReduxModule';

export const initialState = new Map({
  component: ''
});

const reducers = {
  openModal(state, component) {
    return state.set('component', component);
  },
  closeModal(state) {
    return state.delete('component');
  }
};

const selectors = {
  modalSelector: state => state.get('component')
};

export default createReduxModule({
  initialState,
  reducers,
  selectors
});
