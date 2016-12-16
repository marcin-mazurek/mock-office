import React from 'react';

const MockList = ({ mocks, buttonText = 'do action', action }) => (
  <ul>
    {
      mocks.map(mock => (
        <li key={mock.get('id')}>
          <div>Request url: {mock.getIn(['request', 'url'])}</div>
          <div>Response body: {JSON.stringify(mock.getIn(['response', 'body']))}</div>
          <button onClick={() => action(mock.get('id'))}>{buttonText}</button>
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
