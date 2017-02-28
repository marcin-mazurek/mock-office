import React from 'react';
import { Link } from 'react-router';
import ServersConnect from './Servers';

const NavBar = () => (
  <div className="navbar">
    <Link className="navbar__add-server-button" to="/add-server">
      Add server
    </Link>
    <div className="navbar__server-list-header">
      List of servers:
    </div>
    <ServersConnect />
  </div>
);

export default NavBar;
