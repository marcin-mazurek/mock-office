/* eslint-disable import/prefer-default-export */
export const scenarioSelector = (state, id) => state.getIn(['scenarios', 'entities', id]);
