import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { Record } from 'immutable';

export const Notification = new Record({
  id: '',
  text: '',
  type: 'info'
});

export const NotificationsList = ({ notifications, remove }) => (
  <ul className="notifications-list">
    {
      notifications.map(
        ({ id, text, type }) =>
          <li className="notifications-list-item" key={id}>
            <button
              className={`notifications-bubble notifications-bubble--${type}`}
              onClick={() => remove(id)}
            >
              {text}
            </button>
          </li>
      )
    }
  </ul>
);

NotificationsList.propTypes = {
  notifications: ImmutablePropTypes.listOf(PropTypes.instanceOf(Notification)),
  remove: PropTypes.func.isRequired
};
