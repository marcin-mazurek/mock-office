import { Map, fromJS } from 'immutable';
import { OVERLAY_CLICKED } from './actions';

const initialState = new Map({
  component: null,
  params: null
});

const reducers = {
  openModal: (state, component, params) =>
    state.set('component', component)
      .set('params', fromJS(params)),
  closeModal: state => state.delete('component')
};

export const reduce = state => (reducerType, ...params) => {
  if (reducers[reducerType]) {
    return reducers[reducerType](state, ...params);
  }

  return state;
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OVERLAY_CLICKED: {
      return reduce(state)('closeModal');
    }
    default: {
      return state;
    }
  }
};

const createReducerFromActionHandlers = actionHandlers =>
  (state, dispatchedAction) => {
    const actionsToHandle = Object.keys(actionHandlers);
    let i = 0;
    let actionType;

    while (i < actionsToHandle.length) {
      actionType = actionsToHandle[i];
      if (dispatchedAction.type === actionType) {
        return actionHandlers[dispatchedAction.type](reduce(state));
      }

      i += 1;
    }

    return state;
  };

const createReducer = (customActionHandlers) => {
  const customReducer = createReducerFromActionHandlers(customActionHandlers);

  return (state = initialState, action) =>
    reducer(customReducer(state, action), action);
};

export default createReducer;
