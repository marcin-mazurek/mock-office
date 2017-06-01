const createModule = (getInitialState, internalActionHandlers, moduleApi, internalSelectors) => {
  const createReducer = (customActionHandlers) => {
    const allActionHandlers = Object.assign({}, internalActionHandlers, customActionHandlers);

    return (state = getInitialState(), action) => {
      const actionTypes = Object.keys(allActionHandlers);

      for (let i = 0; i < actionTypes.length; i += 1) {
        if (action.type === actionTypes[i]) {
          const handler = allActionHandlers[actionTypes[i]];
          return handler(state, action, moduleApi);
        }
      }

      return state;
    };
  };

  const createSelectors = (stateGetter) => {
    const selectorsNames = Object.keys(internalSelectors);
    const adaptedSelectors = {};

    selectorsNames.forEach((selectorName) => {
      adaptedSelectors[selectorName] = (state, ...rest) =>
        internalSelectors[selectorName](stateGetter(state), ...rest);
    });

    return adaptedSelectors;
  };

  return {
    createSelectors,
    createReducer
  };
};

export default createModule;
