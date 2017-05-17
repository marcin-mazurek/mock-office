import React from 'react';
import PropTypes from 'prop-types';
import NotificationsListConnect from '../notifications/NotificationsList';
import { ModalConnect } from '../modals/Modal';

const App = ({ children }) => (
  <div className="app">
    { children }
    <ModalConnect />
    <NotificationsListConnect />
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
