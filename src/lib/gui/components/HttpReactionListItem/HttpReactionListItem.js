import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const HttpReactionListItem = ({ reaction }) => {
  const delay = reaction.getIn(['schedule', 'delay']);
  const interval = reaction.getIn(['schedule', 'interval']);
  return (
    <div className="reaction-list-item">
      <div className="reaction-list-item__params">
        <div className="reaction-list-item__tag">
          {reaction.getIn(['params', 'status'])}
        </div>
        {
          delay
            ? (
              <div className="reaction-list-item__tag">
                <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          interval
            ? (
              <div className="reaction-list-item__tag">
                <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
              </div>
            )
            : null
        }
      </div>
    </div>
  );
};

HttpReactionListItem.propTypes = {
  reaction: ImmutablePropTypes.map
};

export default HttpReactionListItem;
