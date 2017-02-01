import React from 'react';
import { connect } from 'react-redux';
import { getResponse } from '../../selectors';
import { init } from '../../remove/actions';

const ResponseComponent = ({ response, remove, queueId, responseId }) => (
  <div className="response">
    <div>{JSON.stringify(response.body)}</div>
    <button onClick={() => remove(queueId, responseId)}>Remove</button>
  </div>
);

ResponseComponent.propTypes = {
  responseId: React.PropTypes.string.isRequired,
  response: React.PropTypes.shape({}).isRequired,
  remove: React.PropTypes.func.isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  response: getResponse(state, ownProps.responseId)
});

const mapDispatchToProps = {
  remove: init
};

const Response = connect(mapStateToProps, mapDispatchToProps)(ResponseComponent);

const Responses = ({ responsesIds, queueId }) => (
  <ul className="responses">
    {
      responsesIds.map(id => (
        <li className="responses__item" key={id}>
          <Response responseId={id} queueId={queueId} />
        </li>
      ))
    }
  </ul>
);

Responses.propTypes = {
  responsesIds: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired
};

export default Responses;
