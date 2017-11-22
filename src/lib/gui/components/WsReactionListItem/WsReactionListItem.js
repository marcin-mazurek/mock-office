import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const WsReactionListItem = ({ reaction }) => {
  const delay = reaction.getIn(['schedule', 'delay']);
  const interval = reaction.getIn(['schedule', 'interval']);
  return (
    <div className="reaction-list-item">
      <div className="reaction-list-item__params">
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

WsReactionListItem.propTypes = {
  reaction: ImmutablePropTypes.map
};

export default WsReactionListItem;
