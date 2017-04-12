import React from 'react';
import PropTypes from 'prop-types';
import ErrorListConnect from '../errors/ErrorList';

const App = ({ children }) => (
  <div className="app">
    <ErrorListConnect />
    { children }
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
