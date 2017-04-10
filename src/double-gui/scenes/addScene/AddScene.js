import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../entities/servers/selectors';
import Http from './HttpForm';
import Ws from './WsForm';

export const AddScene = ({ serverType }) => (
  <div className="add-scene">
    <div className="view-header">
      Add scene
    </div>
    <div className="add-scene__main">
      <Link to="/" className="add-scene__back-button">
        <i className="fa fa-arrow-left" />{' Server details'}
      </Link>
      {
        serverType === 'http'
          ? <Http />
          : <Ws />
      }
    </div>
  </div>
);

AddScene.propTypes = {
  serverType: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddScene);
