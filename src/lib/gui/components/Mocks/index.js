import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TasksConnect from '../TaskList/index';
import { mockSelector, scenarioSelector } from '../../app/entities/index';

export const Mock = ({
                       id,
                       title,
                       server,
                       scenario,
                       onRemoveButtonClick,
                       reuse,
                       quantity,
                       requirements,
                       runCount,
                       lastDuration,
                       finished,
                       running
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
        <button
          className="mock__remove-button"
          onClick={() => onRemoveButtonClick(server, scenario, id)}
        >
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
  server: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  requirements: PropTypes.shape({}),
  onRemoveButtonClick: PropTypes.func.isRequired
};

const mockMapStateToProps = (state, ownProps) => {
  const mock = mockSelector(state, ownProps.id);

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

export const REMOVE_BUTTON_CLICKED = 'component/Mock/REMOVE_BUTTON_CLICKED';
const removeButtonClickedAction = (serverId, scenarioId, mockId) => ({
  type: REMOVE_BUTTON_CLICKED,
  serverId,
  scenarioId,
  mockId
});

const mockMapDispatchToProps = {
  onRemoveButtonClick: removeButtonClickedAction
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
  const scenario = scenarioSelector(state, ownProps.scenario);

  return {
    mocks: scenario.mocks
  };
};

export default connect(mapStateToProps)(Mocks);
