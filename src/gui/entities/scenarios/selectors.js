// eslint-disable-next-line import/prefer-default-export
export const getMocks = (scenarioId, state) => state.getIn(['scenarios', scenarioId, 'mocks']);
