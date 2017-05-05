import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classnames from 'classnames';
import { getMock } from '../../entities/mocks/selectors';
import { init } from '../removeMock/actions';
import { getMocks } from '../../entities/scenarios/selectors';
import TasksConnect from '../../tasks/browse/TaskList';

export const Mock = ({
                        id,
                        title,
                        serverId,
                        remove,
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
        <button className="mock__remove-button" onClick={() => remove(serverId, id)}>
          remove
        </button>
      </div>
      <div className="mock__tasks">
        <TasksConnect mockId={id} />
      </div>
    </div>
  );
};

Mock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  serverId: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  reuse: PropTypes.string,
  quantity: PropTypes.number,
  requirements: PropTypes.shape({}),
  runCount: PropTypes.number.isRequired,
  lastDuration: PropTypes.number,
  finished: PropTypes.bool.isRequired,
  running: PropTypes.bool.isRequired
};

const mockSelector = createSelector(
  getMock,
  mock => ({
    title: mock.title,
    reuse: mock.reuse,
    quantity: mock.quantity,
    requirements: mock.requirements,
    finished: mock.finished,
    runCount: mock.runCount,
    lastDuration: mock.lastDuration,
    running: mock.running
  })
);

const mockMapStateToProps = (initialState, ownProps) => state => mockSelector(state, ownProps);

const mockMapDispatchToProps = {
  remove: init
};

export const MockConnect =
  connect(mockMapStateToProps, mockMapDispatchToProps)(Mock);

export const Mocks = ({ mockIds, serverId }) => (
  <ul className="mocks">
    {
      mockIds.map(mockId =>
        <li className="mocks__item" key={mockId}>
          <MockConnect serverId={serverId} id={mockId} />
        </li>
      )
    }
  </ul>
);

Mocks.propTypes = {
  mockIds: PropTypes.shape({}).isRequired,
  serverId: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  mockIds: getMocks(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Mocks);
