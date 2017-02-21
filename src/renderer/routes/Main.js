import React from 'react';
import NavBar from '../app/NavBar';

const Main = ({ children }) => (
  <div className="main">
    <div className="main__nav-bar">
      <NavBar />
    </div>
    <div className="main__content">
      {children}
    </div>
  </div>
);

Main.propTypes = {
  children: React.PropTypes.node
};

export default Main;
