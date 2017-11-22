export const REMOVE_BUTTON_CLICKED = 'ServerViewHeader/REMOVE_BUTTON_CLICKED';
export const removeButtonClickedAction = id => ({
  type: REMOVE_BUTTON_CLICKED,
  id
});
export const ADD_BEHAVIOUR_BUTTON_CLICKED = 'ServerViewHeader/ADD_BEHAVIOUR_BUTTON_CLICKED';
export const addBehaviourButtonClickedAction = (serverId, serverType) => ({
  type: ADD_BEHAVIOUR_BUTTON_CLICKED,
  serverId,
  serverType
});
