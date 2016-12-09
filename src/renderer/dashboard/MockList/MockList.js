import React from 'react';

const MockList = ({ mocks, action, buttonText }) => (
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
  mocks: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  action: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired
};

export default MockList;
