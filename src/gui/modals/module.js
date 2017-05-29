import { Map } from 'immutable';

export const getInitialState = () => new Map({
  component: ''
});

export const reducers = {
  openModal(state, component) {
    return state.set('component', component);
  },
  closeModal(state) {
    return state.delete('component');
  }
};
