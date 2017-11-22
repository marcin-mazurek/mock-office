import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const HttpReactionListItem = ({ reaction }) => {
  const delay = reaction.getIn(['schedule', 'delay']);

  return (
    <div className="reaction-list-item">
      <div className="reaction-list-item__event-property">
        <div className="reaction-list-item__event-property-label">Status</div>
        <div className="reaction-list-item__event-property-value">
          { reaction.getIn(['params', 'status']) || 'Any' }
        </div>
      </div>
      <div className="reaction-list-item__event-property">
        <div className="reaction-list-item__event-property-label">Delay</div>
        <div className="reaction-list-item__event-property-value">
          { delay || 'No' }
        </div>
      </div>
    </div>
  );
};

HttpReactionListItem.propTypes = {
  reaction: ImmutablePropTypes.map
};

export default HttpReactionListItem;
