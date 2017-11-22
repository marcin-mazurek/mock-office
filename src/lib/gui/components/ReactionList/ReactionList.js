import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const ReactionList = ({ reactions, render }) => (
  <ul className="reaction-list">
    {
      reactions.map(reaction =>
        <li className="reaction-list__item" key={reaction}>
          {render(reaction)}
        </li>
      )
    }
  </ul>
);

ReactionList.propTypes = {
  reactions: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  render: PropTypes.func.isRequired
};

export default ReactionList;
