import React from 'react';
import TasksConnect from '../tasks/browseTasks/Tasks';

const Queue = ({ id }) => (
  <div className="queue">
    <div className="queue__tasks">
      <TasksConnect queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  id: React.PropTypes.string.isRequired
};

export default Queue;
