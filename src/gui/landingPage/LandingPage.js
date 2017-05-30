import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from '../entities/servers/module';

export const LandingPage = ({ serverExists }) =>
  <div className="server-placeholder">
    {serverExists ? 'Select server' : 'Add server'}
  </div>;

LandingPage.propTypes = {
  serverExists: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  serverExists: !selectors.allServerSelector(state).isEmpty()
});

export default connect(mapStateToProps)(LandingPage);
