import React from 'react';
import PropTypes from 'prop-types';
import { NotificationsListConnect } from '../NotificationsList';
import Sidebar from '../Sidebar';
import Modal from '../Modal';

const App = ({ children }) => (
  <div className="app">
    <div className="app__sidebar">
      <Sidebar />
    </div>
    <div className="app__content">
      { children }
    </div>
    <Modal />
    <NotificationsListConnect />
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
