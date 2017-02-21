import React from 'react';
import Tasks from '../../../tasks/browseTasks/Tasks';

const Queue = ({ id }) => (
  <div className="queue">
    <div className="queue__tasks">
      <Tasks queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  id: React.PropTypes.string.isRequired
};

export default Queue;
