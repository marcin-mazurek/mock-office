import { Map } from 'immutable';
import configureReduxModule from '../../utils/createReduxModule';
import { OVERLAY_CLICKED } from './Modal';

export * from './Modal';

export const modalsModuleFactory = configureReduxModule(
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
    },
    actionHandlers: {
      [OVERLAY_CLICKED]: (state, action, reducers) =>
        reducers.closeModal(state)
    }
  }
);
