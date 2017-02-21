import React from 'react';
import ServerListConnect from './ServerList';

const Servers = () => (
  <div>
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          List of servers:
        </span>
      </div>
    </header>
    <ServerListConnect />
  </div>
);

export default Servers;
