import React from 'react';
import PropTypes from 'prop-types';
import { ModalConnect } from '../Modal';
import { NotificationsListConnect } from '../NotificationsList';
import Sidebar from '../Sidebar';

const App = ({ children }) => (
  <div className="app">
    <div className="app__sidebar">
      <Sidebar />
    </div>
    <div className="app__content">
      { children }
    </div>
    <ModalConnect />
    <NotificationsListConnect />
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
