import React from 'react';
import { connect } from 'react-redux';
import { getResponse } from '../../selectors';
import { init } from '../../remove/actions';

const Response = ({ response, remove, queueId }) => (
  <div>
    <code>
      {JSON.stringify(response)}
    </code>
    <button onClick={() => remove(queueId, response.id)}>Remove</button>
  </div>
);

Response.propTypes = {
  response: React.PropTypes.shape({}),
  remove: React.PropTypes.func.isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  response: getResponse(state, ownProps.responseId)
});

const mapDispatchToProps = {
  remove: init
};

export default connect(mapStateToProps, mapDispatchToProps)(Response);
