import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { getServerDetails } from '../../entities/servers/selectors';
import AddHttpMockFormConnect from './addHttpMock/AddMockForm';
import AddWsMockFormConnect from './addWsMock/AddWsMockForm';

export const AddMock = ({ serverType, scenarioId, params }) => (
  <Scrollbars>
    <div className="add-mock">
      <Link to={`/server/${params.id}`} className="add-mock__back-button">
        <i className="fa fa-arrow-left" />{' Server details'}
      </Link>
      {
        serverType === 'http'
          ? <AddHttpMockFormConnect scenarioId={scenarioId} />
          : <AddWsMockFormConnect scenarioId={scenarioId} />
      }
    </div>
  </Scrollbars>

);

AddMock.propTypes = {
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

export default connect(mapStateToProps)(AddMock);
