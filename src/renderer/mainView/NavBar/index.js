import React from 'react';
import { Link } from 'react-router';

const NavBar = () => (
  <ul className="nav-bar">
    <li className="nav-bar__item">
      <Link to="/">
        Main
      </Link>
    </li>
    <li className="nav-bar__item">
      <Link to="/servers">
        Servers
      </Link>
    </li>
    <li className="nav-bar__item">
      Add server
    </li>
  </ul>
);

export default NavBar;
