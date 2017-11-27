export const REACTIONS_ENDED = 'appSync/REACTIONS_ENDED';
export const reactionsEndedAction = id => ({
  type: REACTIONS_ENDED,
  id
});
export const REACTIONS_DID_RUN_ACTION = 'appSync/REACTIONS_DID_RUN_ACTION';
export const reactionsDidRunAction = id => ({
  type: REACTIONS_DID_RUN_ACTION,
  id
});
export const REACTIONS_CANCELLED = 'appSync/REACTIONS_CANCELLED';
export const reactionsCancelledAction = id => ({
  type: REACTIONS_CANCELLED,
  id
});
