export const SUBMIT_SUCCEEDED = 'AddHttpBehaviourForm/SUBMIT_SUCCEEDED';
export const submitSucceededAction = (values, serverId) => ({
  type: SUBMIT_SUCCEEDED,
  values,
  serverId
});
