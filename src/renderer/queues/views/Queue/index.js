import React from 'react';
import { connect } from 'react-redux';
import { getQueueResponses } from '../../selectors';
import Responses from '../../../responses/views/Responses';

const Queue = ({ responses, id }) => (
  <div className="queue">
    <div className="queue__responses">
      <Responses responsesIds={responses} queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  responses: React.PropTypes.shape().isRequired,
  id: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  responses: getQueueResponses(ownProps.id, state)
});

export default connect(mapStateToProps)(Queue);
