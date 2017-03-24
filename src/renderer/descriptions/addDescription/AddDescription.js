import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSelectedServerDetails } from '../../servers/selectors';
import Http from './HttpForm';
import Ws from './WsForm';

export const AddDescription = ({ serverType }) => (
  <div className="add-description">
    <div className="view-header">
      Add description
    </div>
    <div className="add-description__main">
      <Link to="/" className="add-description__back-button">
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

AddDescription.propTypes = {
  serverType: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverType: getSelectedServerDetails(state).type
});

export default connect(mapStateToProps)(AddDescription);
