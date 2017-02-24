import React from 'react';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material';

const App = ({ children }) => (
  <div className="app">
    { children }
  </div>
);

App.propTypes = {
  children: React.PropTypes.node
};

export default App;
