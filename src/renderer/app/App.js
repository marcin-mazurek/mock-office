import React from 'react';

const App = ({ children }) => (
  <div className="app">
    { children }
  </div>
);

App.propTypes = {
  children: React.PropTypes.node
};

export default App;
