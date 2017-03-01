import React from 'react';
import { Link } from 'react-router';
import ServersConnect from './Servers';

const NavBar = () => (
  <div className="navbar">
    <div className="navbar__servers navbar-servers">
      <div className="navbar-servers-header">
        Servers: {' '}
        <Link className="button navbar__add-server-button" to="/add-server">
          +
        </Link>
      </div>
      <ServersConnect />
    </div>
  </div>
);

export default NavBar;
