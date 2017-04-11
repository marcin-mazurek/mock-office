import React from 'react';
import ErrorListConnect from '../errors/ErrorList';

const App = ({ children }) => (
  <div className="app">
    <ErrorListConnect />
    { children }
  </div>
);

App.propTypes = {
  children: React.PropTypes.node
};

export default App;
