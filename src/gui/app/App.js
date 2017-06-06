import React from 'react';
import PropTypes from 'prop-types';
import modals from '../modals';
import notifications from '../notifications';

const ModalConnect = modals.components.ModalConnect;
const NotificationsListConnect = notifications.components.NotificationsListConnect;

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
