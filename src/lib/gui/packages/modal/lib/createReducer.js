import { OVERLAY_CLICKED } from './actions';

const initialState = {
  component: null,
  params: null
};

export const openModal = (state, component, params) =>
  Object.assign({}, state, {
    component,
    params
  });

export const closeModal = state => Object.assign({}, state, { component: null });

const createReducer = customReducer =>
  (state = initialState, action) => {
    let newState = state;

    if (typeof customReducer === 'function') {
      newState = customReducer(newState, action);
    }

    switch (action.type) {
      case OVERLAY_CLICKED: {
        return closeModal(newState);
      }
      default: {
        return newState;
      }
    }
  };

export default createReducer;
