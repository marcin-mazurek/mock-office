import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { getServerDetails } from '../../entities/servers/selectors';
import AddSceneFormConnect from './httpServerForm/AddSceneForm';
import Ws from './WsForm';

export const AddScene = ({ serverType, scenarioId, params }) => (
  <Scrollbars>
    <div className="add-scene">
      <Link to={`/server/${params.id}`} className="add-scene__back-button">
        <i className="fa fa-arrow-left" />{' Server details'}
      </Link>
      {
        serverType === 'http'
          ? <AddSceneFormConnect scenarioId={scenarioId} />
          : <Ws />
      }
    </div>
  </Scrollbars>

);

AddScene.propTypes = {
  serverType: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state, ownProps) => {
  const serverDetails = getServerDetails(state, ownProps.params.id);

  return {
    serverType: serverDetails.type,
    scenarioId: serverDetails.id
  };
};

export default connect(mapStateToProps)(AddScene);
