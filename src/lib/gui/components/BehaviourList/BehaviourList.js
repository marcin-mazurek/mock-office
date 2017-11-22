import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const BehaviourList = ({ behaviours, render }) => (
  <ul className="behaviour-list">
    {
      behaviours.map(behaviour =>
        <li className="behaviour-list__item" key={behaviour}>
          {render(behaviour)}
        </li>
      )
    }
  </ul>
);

BehaviourList.propTypes = {
  behaviours: ImmutablePropTypes.list.isRequired,
  render: PropTypes.func.isRequired
};

export default BehaviourList;
