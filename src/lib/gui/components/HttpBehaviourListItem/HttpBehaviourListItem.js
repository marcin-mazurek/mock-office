import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import expandIcon from '../../../../../assets/icons_green_expand@3x.svg';
import trashIcon from '../../../../../assets/icons_gray_trash@3x.svg';
import { ReactionListConnect } from '../ReactionList';
import { HttpReactionListItemConnect } from '../HttpReactionListItem';

export default class HttpBehaviourListItem extends React.Component {
  constructor() {
    super();
    this.showReactions = this.showReactions.bind(this);
    this.state = {
      expanded: false
    };
  }

  showReactions() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const {
      behaviour,
      onRemoveButtonClick,
      serverId
    } = this.props;
    const { expanded } = this.state;
    const behaviourReactionsClassnames = classnames({
      'behaviour-list-item__reactions': true,
      'behaviour-list-item__reactions--visible': expanded
    });

    const expired = behaviour.get('expired');
    const pending = behaviour.get('pending');
    const behaviourClassNames = classnames({
      'behaviour-list-item': true,
      'behaviour-list-item--expired': expired
    });

    const expandButtonClassNames = classnames({
      'behaviour-list-item__expand-button': true,
      'behaviour-list-item__expand-button--active': expanded
    });

    const id = behaviour.get('id');
    const runCounter = behaviour.get('runCounter');
    const loadedCounter = behaviour.get('loadedCounter');
    const spinnerClassNames = classnames({
      spinner: true,
      'spinner--active': pending
    });
    return (
      <div className={behaviourClassNames}>
        <span className="behaviour-list-item__line" />
        <div className="behaviour-list-item-behaviour">
          <button className={expandButtonClassNames} onClick={this.showReactions}>
            <img src={expandIcon} role="presentation" />
          </button>
          <div className="behaviour-list-item__params">
            <div className="behaviour-list-item__spinner">
              <div className={spinnerClassNames}>
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
            <div className="behaviour-list-item__tag">{`${runCounter}/${loadedCounter}`}</div>
          </div>
          <div className="behaviour-list-item__behaviour">
            <div className="behaviour-list-item__tag">
              {behaviour.getIn(['event', 'method'])}
            </div>
            <div className="behaviour-list-item__tag">{behaviour.getIn(['event', 'path'])}</div>
            <button
              className="behaviour-list-item__remove-button"
              onClick={() => onRemoveButtonClick(serverId, id)}
            >
              <img
                src={trashIcon}
                className="behaviour-list-item__remove-button-icon"
                alt="remove behaviour button"
              />
            </button>
          </div>
        </div>
        <div className={behaviourReactionsClassnames}>
          <ReactionListConnect
            behaviour={id}
            render={reactionId => <HttpReactionListItemConnect id={reactionId} />}
          />
        </div>
      </div>
    );
  }
}

HttpBehaviourListItem.propTypes = {
  behaviour: ImmutablePropTypes.map.isRequired,
  onRemoveButtonClick: PropTypes.func.isRequired,
  serverId: PropTypes.string.isRequired,
};
