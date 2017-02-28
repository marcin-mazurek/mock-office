import React from 'react';
import NavBar from '../navbar/NavBar';

const Main = ({ children }) => (
  <div className="main">
    <div className="main__navbar">
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
