import React from 'react';
import FilePicker from '../../mocks/addFromFile/FilePicker';
import Expectations from '../Expectations';
import AddServer from '../AddServer';

const Server = ({ toggleLive, buttonText }) => (
  <div className="server">
    <AddServer />
    <FilePicker />
    <Expectations />
    <button onClick={toggleLive}>
      {buttonText}
    </button>
  </div>
);

Server.propTypes = {
  toggleLive: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired
};

export default Server;
