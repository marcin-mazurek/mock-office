// eslint-disable-next-line import/prefer-default-export
export const getDescription = (state, props) => state.getIn(['descriptions', props.id]);
