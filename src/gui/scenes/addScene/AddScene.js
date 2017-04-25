import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getServerDetails } from '../../entities/servers/selectors';
import HttpFormConnect from './httpServerForm/HttpForm';
import Ws from './WsForm';

export const AddScene = ({ serverType, scenarioId }) => (
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
          ? <HttpFormConnect scenarioId={scenarioId} />
          : <Ws />
      }
    </div>
  </div>
);

AddScene.propTypes = {
  serverType: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const serverDetails = getServerDetails(state, ownProps.params.id);

  return {
    serverType: serverDetails.type,
    scenarioId: serverDetails.id
  };
};

export default connect(mapStateToProps)(AddScene);
