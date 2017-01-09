import React from 'react';
import { Link } from 'react-router';

const NavBar = () => (
  <ul className="nav-bar">
    <li className="nav-bar__item">
      <Link to="/">
        Servers
      </Link>
    </li>
    <li className="nav-bar__item">
      <Link to="/add-server">
        Add server
      </Link>
    </li>
  </ul>
);

export default NavBar;
