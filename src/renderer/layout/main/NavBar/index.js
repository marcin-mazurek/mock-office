import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-mdl';

const NavBar = () => (
  <ul className="nav-bar">
    <li className="nav-bar__item">
      <Link to="/">
        <Button raised ripple>
          Servers
        </Button>
      </Link>
    </li>
    <li className="nav-bar__item">
      <Link to="/add-server">
        <Button raised colored ripple>
          Add server
        </Button>
      </Link>
    </li>
  </ul>
);

export default NavBar;
