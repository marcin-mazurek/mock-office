import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import expandIcon from '../../../../../assets/icons_green_expand@3x.svg';
import { TaskListConnect } from '../TaskList';
import { HttpTaskListItemConnect } from '../HttpTaskListItem';
import { WsTaskListItemConnect } from '../WsTaskListItem';

export default class HttpMockListItem extends React.Component {
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
      mock,
      onRemoveButtonClick,
      server,
      scenario
    } = this.props;
    const { expanded } = this.state;
    const mockTasksClassnames = classnames({
      'mock-list-item__response': true,
      'mock-list-item__response--visible': expanded
    });

    const expired = mock.get('expired');
    const pending = mock.get('pending');
    const mockClassNames = classnames({
      'mock-list-item': true,
      'mock-list-item--expired': expired
    });

    const expandButtonClassNames = classnames({
      'mock-list-item__expand-button': true,
      'mock-list-item__expand-button--active': expanded
    });

    const id = mock.get('id');
    const runCounter = mock.get('runCounter');
    const loadedCounter = mock.get('loadedCounter');
    const spinnerClassNames = classnames({
      spinner: true,
      'spinner--active': pending
    });
    return (
      <div className={mockClassNames}>
        <div className="mock-list-item__request">
          <button className={expandButtonClassNames} onClick={this.showTasks}>
            <img src={expandIcon} role="presentation" />
          </button>
          <div className="mock-list-item__spinner">
            <div className={spinnerClassNames}>
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
          </div>
          <div className="mock-list-item__tag">{`${runCounter}/${loadedCounter}`}</div>
          <div className="mock-list-item__tag">
            {mock.getIn(['requirements', 'method'])}
          </div>
          <div className="mock-list-item__tag">{mock.getIn(['requirements', 'path'])}</div>
          <button
            className="mock-list-item__remove-button"
            onClick={() => onRemoveButtonClick(server, scenario, id)}
          >
            remove
          </button>
        </div>
        <div className={mockTasksClassnames}>
          <TaskListConnect
            mock={id}
            render={taskId => <HttpTaskListItemConnect id={taskId} />}
          />
        </div>
      </div>
    );
  }
}

HttpMockListItem.propTypes = {
  mock: ImmutablePropTypes.map.isRequired,
  onRemoveButtonClick: PropTypes.func.isRequired,
  server: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired
};
