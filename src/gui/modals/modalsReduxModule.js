import { Map } from 'immutable';
import configureReduxModule from '../utils/createReduxModule';

export default configureReduxModule(
  {
    initialState: new Map({
      component: ''
    }),
    reducers: {
      openModal(state, component) {
        return state.set('component', component);
      },
      closeModal(state) {
        return state.delete('component');
      }
    },
    selectors: {
      modalSelector: state => state.get('component')
    }
  }
);
