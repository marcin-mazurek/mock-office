import { Map } from 'immutable';

export const initialState = () => new Map({
  component: ''
});

export const openModal = (state, component) => state.set('component', component);
export const closeModal = state => state.delete('component');
