import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AddServerFormConnect from './AddServerForm';

const AddServer = () => (
  <div className="add-server-page">
    <Scrollbars>
      <div className="add-server-page__form">
        <AddServerFormConnect />
      </div>
    </Scrollbars>
  </div>
);

export default AddServer;
