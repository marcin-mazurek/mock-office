import React from 'react';
import PropTypes from 'prop-types';
import NotificationsListConnect from '../notifications/NotificationsList';

const App = ({ children }) => (
  <div className="app">
    { children }
    <NotificationsListConnect />
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
