export const REMOVE_BUTTON_CLICKED = 'WsMockListItem/REMOVE_BUTTON_CLICKED';
export const removeButtonClickedAction = (serverId, scenarioId, mockId) => ({
  type: REMOVE_BUTTON_CLICKED,
  serverId,
  scenarioId,
  mockId
});
