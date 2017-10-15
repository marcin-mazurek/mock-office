import React from 'react';
import PropTypes from 'prop-types';
import { MockListItemConnect } from '../MockListItem';

const MockList = ({ mocks, server, scenario, Renderer }) => {
  const CurrentRenderer = Renderer || MockListItemConnect;
  return (
    <ul className="mock-list">
      {
        mocks.map(mock =>
          <li className="mock-list__item" key={mock}>
            <CurrentRenderer server={server} scenario={scenario} id={mock} />
          </li>
        )
      }
    </ul>
  );
};

MockList.propTypes = {
  mocks: PropTypes.shape({}).isRequired,
  server: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  Renderer: PropTypes.func
};

export default MockList;
