import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ id, onNotificationClick, message, mood, disposable }) => {
  const notificationTypeClassname = mood ? `notifications-bubble--${mood}` : '';

  return (
    <div
      className={`notifications-bubble ${notificationTypeClassname}`}
    >
      {message}
      {
        disposable &&
        <button
          className="notifications-bubble__remove-button"
          onClick={() => onNotificationClick(id)}
        >
          <img
            className="notifications-bubble__remove-icon"
            alt="x icon"
            // eslint-disable-next-line max-len
            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgOTUuOTM5IDk1LjkzOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgOTUuOTM5IDk1LjkzOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik02Mi44MTksNDcuOTdsMzIuNTMzLTMyLjUzNGMwLjc4MS0wLjc4MSwwLjc4MS0yLjA0NywwLTIuODI4TDgzLjMzMywwLjU4NkM4Mi45NTgsMC4yMTEsODIuNDQ4LDAsODEuOTE5LDAgICBjLTAuNTMsMC0xLjAzOSwwLjIxMS0xLjQxNCwwLjU4Nkw0Ny45NywzMy4xMjFMMTUuNDM1LDAuNTg2Yy0wLjc1LTAuNzUtMi4wNzgtMC43NS0yLjgyOCwwTDAuNTg3LDEyLjYwOCAgIGMtMC43ODEsMC43ODEtMC43ODEsMi4wNDcsMCwyLjgyOEwzMy4xMjEsNDcuOTdMMC41ODcsODAuNTA0Yy0wLjc4MSwwLjc4MS0wLjc4MSwyLjA0NywwLDIuODI4bDEyLjAyLDEyLjAyMSAgIGMwLjM3NSwwLjM3NSwwLjg4NCwwLjU4NiwxLjQxNCwwLjU4NmMwLjUzLDAsMS4wMzktMC4yMTEsMS40MTQtMC41ODZMNDcuOTcsNjIuODE4bDMyLjUzNSwzMi41MzUgICBjMC4zNzUsMC4zNzUsMC44ODQsMC41ODYsMS40MTQsMC41ODZjMC41MjksMCwxLjAzOS0wLjIxMSwxLjQxNC0wLjU4NmwxMi4wMi0xMi4wMjFjMC43ODEtMC43ODEsMC43ODEtMi4wNDgsMC0yLjgyOEw2Mi44MTksNDcuOTcgICB6IiBmaWxsPSIjRkZGRkZGIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
          />
        </button>
      }
    </div>
  );
};

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  onNotificationClick: PropTypes.func,
  message: PropTypes.string.isRequired,
  disposable: PropTypes.bool,
  mood: PropTypes.string
};

Notification.defaultProps = {
  disposable: true,
  onNotificationClick: () => {},
  mood: ''
};

export default Notification;
