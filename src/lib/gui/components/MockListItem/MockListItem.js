import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TasksConnect from '../TaskList/index';
import expandIcon from '../../../../../assets/icons_green_expand@3x.svg';

export default class MockListItem extends React.Component {
  constructor() {
    super();
    this.showTasks = this.showTasks.bind(this);
    this.state = {
      expanded: false
    };
  }

  showTasks() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const {
      id,
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
    } = this.props;
    const { expanded } = this.state;
    const mockTasksClassnames = classnames('mock-list-item__tasks',
      {
        'mock-list-item__tasks--expanded': expanded
      }
    );

    let quantityInfo = null;

    if (reuse) {
      if (reuse === 'infinite') {
        quantityInfo = <i className="fa fa-repeat" />;
      } else if (reuse === 'fixed') {
        quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
      }
    }

    const mockClassNames = classnames({
      'mock-list-item': true,
      'mock-list-item--finished': finished,
      'mock-list-item--running': running
    });

    return (
      <div className={mockClassNames}>
        <div className="mock-list-item-details">
          <div className="mock-list-item-spec">
            <div className="mock-list-item-spec__tag">{requirements.event}</div>
            {
              reuse
                ? <div className="mock-list-item-spec__tag">{quantityInfo}</div>
                : null
            }
            {
              runCount > 0
                ? (
                  <div className="mock-list-item-status__tag" title="Run count">
                    <i className="fa fa-flash" /> {runCount}
                  </div>
                )
                : null
            }
            {
              lastDuration
                ? (
                  <div className="mock-list-item-status__tag" title="Last duration">
                    <i className="fa fa-clock-o" /> {lastDuration}{'ms'}
                  </div>
                )
                : null
            }
          </div>
          <button
            className="mock-list-item__remove-button"
            onClick={() => onRemoveButtonClick(server, scenario, id)}
          >
            remove
          </button>
          <button className="task-expand-button" onClick={this.showTasks}>
            <img src={expandIcon} role="presentation" />
          </button>
        </div>
        <div className={mockTasksClassnames}>
          <TasksConnect mock={id} />
        </div>
      </div>
    );
  }
}

MockListItem.propTypes = {
  id: PropTypes.string.isRequired,
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
