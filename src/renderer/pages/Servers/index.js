import React from 'react';
import ServerList from './ServerList';

const Servers = () => (
  <div>
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          List of servers:
        </span>
      </div>
    </header>
    <ServerList />
  </div>
);

export default Servers;
