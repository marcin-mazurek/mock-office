import React from 'react';

const MockList = ({ mocks, buttonText = 'do action', action }) => (
  <ul>
    {
      mocks.map(mock => (
        <li key={mock.id}>
          <div>Request url: {mock.request.url}</div>
          <div>Response body: {JSON.stringify(mock.response.body)}</div>
          <button onClick={() => action(mock.id)}>{buttonText}</button>
        </li>
      ))
    }
  </ul>
);

MockList.propTypes = {
  mocks: React.PropTypes.shape(),
  buttonText: React.PropTypes.string,
  action: React.PropTypes.func
};

export default MockList;
