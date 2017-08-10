import React from 'react';
import PropTypes from 'prop-types';
import { ModalConnect } from '../components/Modal';
import { NotificationsListConnect } from '../notifications';

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
