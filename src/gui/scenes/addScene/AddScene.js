import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../entities/servers/selectors';
import HttpServerAddSceneFormConnect from './HttpServerAddSceneForm';
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
          ? <HttpServerAddSceneFormConnect />
          : <Ws />
      }
    </div>
  </div>
);

AddScene.propTypes = {
  serverType: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddScene);
