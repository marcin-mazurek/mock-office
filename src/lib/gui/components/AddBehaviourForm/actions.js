export const SUBMIT_SUCCEEDED = 'AddBehaviourForm/SUBMIT_SUCCEEDED';
export const submitSucceededAction = (values, serverId) => ({
  type: SUBMIT_SUCCEEDED,
  values,
  serverId
});
