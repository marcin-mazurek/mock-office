import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { serverSelector } from '../../entities/servers/selectors';
import AddHttpMockFormConnect from './addHttpMock/AddMockForm';
import AddWsMockFormConnect from './addWsMock/AddWsMockForm';

export const AddMock = ({ serverType, scenario, params }) => (
  <Scrollbars>
    <div className="add-mock">
      <Link to={`/server/${params.id}`} className="add-mock__back-button">
        <i className="fa fa-arrow-left" />{' Server details'}
      </Link>
      {
        serverType === 'http'
          ? <AddHttpMockFormConnect scenario={scenario} server={params.id} />
          : <AddWsMockFormConnect scenario={scenario} server={params.id} />
      }
    </div>
  </Scrollbars>

);

AddMock.propTypes = {
  serverType: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state, ownProps) => {
  const serverDetails = serverSelector(state, ownProps.params.id);

  return {
    serverType: serverDetails.type,
    scenario: serverDetails.scenario
  };
};

const AddMockConnect = connect(mapStateToProps)(AddMock);

export default AddMockConnect;
