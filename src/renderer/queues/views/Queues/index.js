import React from 'react';
import { connect } from 'react-redux';
import { getServerQueues } from '../../selectors';
import Responses from '../../../responses/views/Responses';

const Queue = ({ id, request, responsesIds }) => (
  <div className="queue">
    <div className="queue__request">
      <div>{JSON.stringify(request)}</div>
    </div>
    <div className="queue__responses">
      <Responses responsesIds={responsesIds} queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  id: React.PropTypes.string.isRequired,
  request: React.PropTypes.shape().isRequired,
  responsesIds: React.PropTypes.shape().isRequired
};

const Queues = ({ queues }) => (
  <ul className="queues">
    {
      queues.map(queue => (
        <li className="queues__item" key={queue.id}>
          <Queue request={queue.request} responsesIds={queue.responses} id={queue.id} />
        </li>
      ))
    }
  </ul>
);

Queues.propTypes = {
  queues: React.PropTypes.shape()
};

const mapStateToProps = state => ({
  queues: getServerQueues(state)
});

export default connect(mapStateToProps)(Queues);
