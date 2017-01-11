import React from 'react';
import AddServerForm from '../../servers/addServer/AddServerForm';

const AddServerPage = () => (
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

export default AddServerPage;
