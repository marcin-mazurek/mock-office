import React from 'react';

const MockList = ({ mocks, load }) => (
  <ul>
    {
      mocks.map(mock => (
        <li key={mock.id}>
          <a href="" onClick={() => load(mock.id)}>
            <div>Request url: {mock.request.url}</div>
            <div>Response body: {JSON.stringify(mock.response.body)}</div>
          </a>
        </li>
      ))
    }
  </ul>
);

MockList.propTypes = {
  mocks: React.PropTypes.arrayOf(
    React.PropTypes.object
  ).isRequired,
  load: React.PropTypes.func.isRequired
};

export default MockList;
