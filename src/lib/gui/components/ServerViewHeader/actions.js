export const REMOVE_BUTTON_CLICKED = 'ServerViewHeader/REMOVE_BUTTON_CLICKED';
export const removeButtonClickedAction = id => ({
  type: REMOVE_BUTTON_CLICKED,
  id
});
export const ADD_MOCK_BUTTON_CLICKED = 'ServerViewHeader/ADD_MOCK_BUTTON_CLICKED';
export const addMockButtonClickedAction = (server, scenario, serverType) => ({
  type: ADD_MOCK_BUTTON_CLICKED,
  server,
  scenario,
  serverType
});
