import React from 'react';
import { connect } from 'react-redux';
import { getExpectation } from '../../selectors';
import { init } from '../../remove/actions';

const ExpectationComponent = ({ expectation, remove, queueId, expectationId }) => (
  <div className="expectation">
    <div>{JSON.stringify(expectation)}</div>
    <button onClick={() => remove(queueId, expectationId)}>Remove</button>
  </div>
);

ExpectationComponent.propTypes = {
  expectationId: React.PropTypes.string.isRequired,
  expectation: React.PropTypes.shape({}).isRequired,
  remove: React.PropTypes.func.isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  expectation: getExpectation(state, ownProps.expectationId)
});

const mapDispatchToProps = {
  remove: init
};

const Expectation = connect(mapStateToProps, mapDispatchToProps)(ExpectationComponent);

const Expectations = ({ expectationsIds, queueId }) => (
  <ul className="expectations">
    {
      expectationsIds.map(id => (
        <li className="expectations__item" key={id}>
          <Expectation expectationId={id} queueId={queueId} />
        </li>
      ))
    }
  </ul>
);

Expectations.propTypes = {
  expectationsIds: React.PropTypes.shape({}).isRequired,
  queueId: React.PropTypes.string.isRequired
};

export default Expectations;
