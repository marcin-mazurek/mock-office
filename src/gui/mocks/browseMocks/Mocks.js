import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import { init } from '../removeMock/actions';
import TasksConnect from '../../tasks/browse/TaskList';
import { selectors } from '../../entities/module';

export const Mock = ({
                       id,
                       title,
                       server,
                       scenario,
                       remove,
                       reuse,
                       quantity,
                       requirements,
                       runCount,
                       lastDuration,
                       finished,
                       running,
                       tasks
                     }) => {
  let quantityInfo = null;

  if (reuse) {
    if (reuse === 'infinite') {
      quantityInfo = <i className="fa fa-repeat" />;
    } else if (reuse === 'fixed') {
      quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
    }
  }

  const mockClassNames = classnames({
    mock: true,
    'mock--finished': finished,
    'mock--running': running
  });

  return (
    <div className={mockClassNames}>
      <div className="mock-details">
        <div className="mock__title">{title}</div>
        <div className="mock-spec">
          <div className="mock-spec__tag">{requirements.event}</div>
          {
            reuse
              ? <div className="mock-spec__tag">{quantityInfo}</div>
              : null
          }
          {
            runCount > 0
              ? (
                <div className="mock-status__tag" title="Run count">
                  <i className="fa fa-flash" /> {runCount}
                </div>
              )
              : null
          }
          {
            lastDuration
              ? (
                <div className="mock-status__tag" title="Last duration">
                  <i className="fa fa-clock-o" /> {lastDuration}{'ms'}
                </div>
              )
              : null
          }
        </div>
        <button className="mock__remove-button" onClick={() => remove(server, scenario, id, tasks)}>
          remove
        </button>
      </div>
      <div className="mock__tasks">
        <TasksConnect mock={id} />
      </div>
    </div>
  );
};
Mock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  reuse: PropTypes.string,
  quantity: PropTypes.number.isRequired,
  runCount: PropTypes.number.isRequired,
  lastDuration: PropTypes.number,
  finished: PropTypes.bool.isRequired,
  running: PropTypes.bool.isRequired,
  tasks: ImmutablePropTypes.listOf(PropTypes.string),
  server: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  requirements: PropTypes.shape({}),
  remove: PropTypes.func.isRequired
};

const mockMapStateToProps = (state, ownProps) => {
  const mock = selectors.mockSelector(state, ownProps.id);

  return {
    id: mock.id,
    title: mock.title,
    reuse: mock.reuse,
    quantity: mock.quantity,
    requirements: mock.requirements,
    runCount: mock.runCount,
    lastDuration: mock.lastDuration,
    finished: mock.finished,
    running: mock.running,
    tasks: mock.tasks
  };
};
const mockMapDispatchToProps = {
  remove: init
};
export const MockConnect =
  connect(mockMapStateToProps, mockMapDispatchToProps)(Mock);

export const Mocks = ({ mocks, server, scenario }) => (
  <ul className="mocks">
    {
      mocks.map(mock =>
        <li className="mocks__item" key={mock}>
          <MockConnect server={server} scenario={scenario} id={mock} />
        </li>
      )
    }
  </ul>
);
Mocks.propTypes = {
  mocks: PropTypes.shape({}).isRequired,
  server: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const scenario = selectors.scenarioSelector(state, ownProps.scenario);

  return {
    mocks: scenario.mocks
  };
};

export default connect(mapStateToProps)(Mocks);
