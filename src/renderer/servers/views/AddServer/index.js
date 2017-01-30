import React from 'react';
import AddServerForm from '../../addServer/AddServerForm';

const AddServer = () => (
  <div>
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          Add server:
        </span>
      </div>
    </header>
    <AddServerForm />
  </div>
);

export default AddServer;
