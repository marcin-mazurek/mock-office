import { ifElse, has } from 'ramda';
import { FILE_PICKED } from '../../components/FilePicker/index';
import api from '../../resources/api';

export const SUCCEEDED = 'importMock/SUCCEEDED';
export const succeededAction = (scenario, mocks) => ({
  type: SUCCEEDED,
  scenario,
  mocks
});
export const FAILED = 'importMock/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});

export const hasError = has('error');
const readFromFile = (action) => {
  const { scenario, server, files } = action;
  const file = files[0];

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => resolve({
      mocks: JSON.parse(e.target.result),
      scenario,
      server
    });
  });
};
const makeRequests = requestParams =>
  Promise.all(
    requestParams.mocks.map(
      mock => api.addMock(requestParams.server, requestParams.scenario, mock)
    )
  )
    .then(mocks => ({
      mocks: mocks.map(m => Object.assign({ id: m.id }, m)),
      scenario: requestParams.scenario
    }))
    .catch(error => ({ error }));
const onFail = result => failedAction(result.error);
const onSuccess = ({ mocks, scenario }) =>
  succeededAction(scenario, mocks);

export default action$ =>
  action$.ofType(FILE_PICKED)
    .flatMap(readFromFile)
    .flatMap(makeRequests)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
