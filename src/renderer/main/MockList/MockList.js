import React from 'react';

const MockList = ({ mocks, buttonText = 'do action', action, serverId }) => (
  <ul>
    {
      mocks
        ? (
        mocks.map(mock => (
          <li key={mock.get('id')}>
            <div>Request url: {mock.getIn(['request', 'url'])}</div>
            <div>Response body: {JSON.stringify(mock.getIn(['response', 'body']))}</div>
            <button onClick={() => action(serverId, mock.get('id'))}>{buttonText}</button>
          </li>
        ))
      ) : null
    }
  </ul>
);

MockList.propTypes = {
  mocks: React.PropTypes.shape(),
  buttonText: React.PropTypes.string,
  action: React.PropTypes.func,
  serverId: React.PropTypes.string.isRequired
};

export default MockList;
