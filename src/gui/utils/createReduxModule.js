const configureModule = (config) => {
  const { initialState, actionHandlers, reducers, selectors } = config;

  const createReducer = (customActionHandlers) => {
    const allActionHandlers = Object.assign({}, actionHandlers, customActionHandlers);

    return (state = initialState, action) => {
      const actionTypes = Object.keys(allActionHandlers);

      for (let i = 0; i < actionTypes.length; i += 1) {
        if (action.type === actionTypes[i]) {
          const handler = allActionHandlers[actionTypes[i]];
          return handler(state, action, reducers);
        }
      }

      return state;
    };
  };

  const createSelectors = (stateGetter) => {
    const selectorsNames = Object.keys(selectors);
    const adaptedSelectors = {};

    selectorsNames.forEach((selectorName) => {
      adaptedSelectors[selectorName] = (state, ...rest) =>
        selectors[selectorName](stateGetter(state), ...rest);
    });

    return adaptedSelectors;
  };

  const createComponents = (componentFactories, adaptedSelectors) => {
    const components = {};
    const factoriesNames = Object.keys(componentFactories);
    factoriesNames.forEach((factoryName) => {
      components[factoryName] = componentFactories[factoryName](adaptedSelectors);
    });

    return components;
  };

  return function createModule(customActionHandlers, stateGetter, componentFactories) {
    const adaptedSelectors = createSelectors(stateGetter);
    return {
      reducer: createReducer(customActionHandlers),
      selectors: adaptedSelectors,
      components: createComponents(componentFactories, adaptedSelectors)
    };
  };
};

export default configureModule;
