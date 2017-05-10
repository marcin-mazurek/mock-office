import React from 'react';
import PropTypes from 'prop-types';
import NotificationsListConnect from '../notifications/NotificationsList';
import AddServerModalConnect from '../servers/addServer/modal/AddServerModal';

const App = ({ children }) => (
  <div className="app">
    { children }
    <NotificationsListConnect />
    <AddServerModalConnect />
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
