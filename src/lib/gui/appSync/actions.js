export const RESTORE_STATE = 'appSync/RESTORE_STATE_MESSAGE_RECEIVED';
export const restoreStateAction = servers => ({
  type: RESTORE_STATE,
  servers
});

export const REMOVE_MOCK_MESSAGE_RECEIVED = 'appSync/REMOVE_MOCK_MESSAGE_RECEIVED';
export const removeAfterUseMessageReceivedAction = (scenario, id) => ({
  type: REMOVE_MOCK_MESSAGE_RECEIVED,
  scenario,
  id
});
export const STOP_MOCK_MESSAGE_RECEIVED = 'appSync/STOP_MOCK_MESSAGE_RECEIVED';
export const stopMockMessageReceivedAction = id => ({
  type: STOP_MOCK_MESSAGE_RECEIVED,
  id
});
export const FINISH_MOCK_MESSAGE_RECEIVED = 'appSync/FINISH_MOCK_MESSAGE_RECEIVED';
export const finishMockMessageReceivedAction = id => ({
  type: FINISH_MOCK_MESSAGE_RECEIVED,
  id
});
export const RUN_MOCK_MESSAGE_RECEIVED = 'appSync/RUN_MOCK_MESSAGE_RECEIVED';
export const runMockMessageReceivedAction = id => ({
  type: RUN_MOCK_MESSAGE_RECEIVED,
  id
});
export const CANCEL_MOCK_MESSAGE_RECEIVED = 'appSync/CANCEL_MOCK_MESSAGE_RECEIVED';
export const cancelMockMessageReceived = id => ({
  type: CANCEL_MOCK_MESSAGE_RECEIVED,
  id
});
