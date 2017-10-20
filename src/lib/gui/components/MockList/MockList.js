import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const MockList = ({ mocks, render }) => (
  <ul className="mock-list">
    {
      mocks.map(mock =>
        <li className="mock-list__item" key={mock}>
          {render(mock)}
        </li>
      )
    }
  </ul>
);

MockList.propTypes = {
  mocks: ImmutablePropTypes.list.isRequired,
  render: PropTypes.func.isRequired
};

export default MockList;
