import React from 'react';
import { connect } from 'react-redux';
import { getServerQueues } from '../../selectors';
import Response from '../../../responses/views/Response';

const Queues = ({ queues }) => (
  <div>
    <ul>
      {
        queues.map(queue => (
          <li key={queue.id}>
            <div>
              <div>request</div>
              <div>{JSON.stringify(queue.request)}</div>
            </div>
            <div>
              <div>responses</div>
              <ul>
                {
                  queue.responses.map(response => (
                    <li key={response}>
                      <Response responseId={response} queueId={queue.id} />
                    </li>
                  ))
                }
              </ul>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
);

Queues.propTypes = {
  queues: React.PropTypes.shape()
};

const mapStateToProps = state => ({
  queues: getServerQueues(state)
});

export default connect(mapStateToProps)(Queues);
