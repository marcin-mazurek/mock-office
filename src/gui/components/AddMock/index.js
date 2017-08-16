import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import AddHttpMockFormConnect from '../AddHttpMockForm/index';
import AddWsMockFormConnect from '../AddWsMockForm/index';
import { paramsSelector } from '../../mocks/addMock/selectors';

export const AddMock = ({ serverType, scenario, server }) => (
  <div className="add-mock">
    <Scrollbars>
      <div className="add-mock__form">
        {
          serverType === 'http'
            ? <AddHttpMockFormConnect scenario={scenario} server={server} />
            : <AddWsMockFormConnect scenario={scenario} server={server} />
        }
      </div>
    </Scrollbars>
  </div>
);

AddMock.propTypes = {
  serverType: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  const params = paramsSelector(state);

  return {
    serverType: params.get('serverType'),
    scenario: params.get('scenario'),
    server: params.get('server')
  };
};

export const AddMockConnect = connect(mapStateToProps)(AddMock);
