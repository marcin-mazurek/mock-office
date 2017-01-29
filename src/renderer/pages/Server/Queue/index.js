import React from 'react';
import { connect } from 'react-redux';
import Request from './Request';
import Response from './Response';
import { getRequest, getResponses } from '../../../queues/selectors';

const HttpQueue = ({ request, responses }) => (
  <div>
    <div>
      <Request>{request.toString()}</Request>
    </div>
    <ul>
      {
        responses.map(response => (
          <Response response={response} />
        ))
      }
    </ul>
  </div>
);

const mapStateToProps = state => ({
  request: getRequest(state),
  responses: getResponses(state)
});

export default connect(mapStateToProps)(HttpQueue);
