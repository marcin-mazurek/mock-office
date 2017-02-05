import React from 'react';
import { connect } from 'react-redux';
import { getQueueExpectations } from '../../selectors';
import Expectations from '../../../expectations/views/Expectations';

const Queue = ({ expectations, id }) => (
  <div className="queue">
    <div className="queue__expectations">
      <Expectations expectationsIds={expectations} queueId={id} />
    </div>
  </div>
);

Queue.propTypes = {
  expectations: React.PropTypes.shape().isRequired,
  id: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  expectations: getQueueExpectations(ownProps.id, state)
});

export default connect(mapStateToProps)(Queue);
