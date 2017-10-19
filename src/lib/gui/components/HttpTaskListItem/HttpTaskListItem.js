import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const HttpTaskListItem = ({ task }) => {
  const delay = task.getIn(['schedule', 'delay']);
  const interval = task.getIn(['schedule', 'interval']);
  return (
    <div className="task-list-item">
      <div className="task-list-item__tag">
        {task.getIn(['params', 'status'])}
      </div>
      {
        delay
          ? (
            <div className="task-list-item__tag">
              <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
            </div>
          )
          : null
      }
      {
        interval
          ? (
            <div className="task-list-item__tag">
              <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
            </div>
          )
          : null
      }
    </div>
  );
};

HttpTaskListItem.propTypes = {
  task: ImmutablePropTypes.map
};

export default HttpTaskListItem;
