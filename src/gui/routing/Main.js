import React from 'react';
import PropTypes from 'prop-types';
import SideBar from '../sidebar/SideBar';

const Main = ({ children }) => (
  <div className="main">
    <div className="main__navbar">
      <SideBar />
    </div>
    <div className="main__content">
      {children}
    </div>
  </div>
);

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
