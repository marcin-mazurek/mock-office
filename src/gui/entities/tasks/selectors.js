/* eslint-disable import/prefer-default-export */
export const taskSelector = (state, id) => state.getIn(['tasks', 'entities', id]);
