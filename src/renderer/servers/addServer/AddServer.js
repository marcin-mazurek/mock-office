import React from 'react';
import AddServerFormConnect from './AddServerForm';

const AddServer = () => (
  <div>
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          Add server:
        </span>
      </div>
    </header>
    <AddServerFormConnect />
  </div>
);

export default AddServer;
