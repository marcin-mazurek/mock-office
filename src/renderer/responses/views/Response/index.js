import React from 'react';
import { connect } from 'react-redux';
import { getResponse } from '../../selectors';

const Response = ({ response }) => (
  <div>{JSON.stringify(response)}</div>
);

Response.propTypes = {
  response: React.PropTypes.shape({})
};

const mapStateToProps = (state, ownProps) => ({
  response: getResponse(state, ownProps.responseId)
});

export default connect(mapStateToProps)(Response);
