export const REMOVE_BUTTON_CLICKED = 'InspectServer/REMOVE_BUTTON_CLICKED';
export const removeButtonClickedAction = id => ({
  type: REMOVE_BUTTON_CLICKED,
  id
});
export const SWITCH_BUTTON_CLICKED = 'InspectServer/SWITCH_BUTTON_CLICKED';
export const switchButtonClickedAction = (id, isOn) => ({
  type: SWITCH_BUTTON_CLICKED,
  id,
  isOn
});
export const ADD_MOCK_BUTTON_CLICKED = 'InspectServer/ADD_MOCK_BUTTON_CLICKED';
export const addMockButtonClickedAction = (server, scenario, serverType) => ({
  type: ADD_MOCK_BUTTON_CLICKED,
  server,
  scenario,
  serverType
});