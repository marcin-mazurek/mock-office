import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { allServerSelector } from '../entities/servers/selectors';

export const LandingPage = ({ serverExists }) =>
  <div className="server-placeholder">
    {serverExists ? 'Select server' : 'Add server'}
  </div>;

LandingPage.propTypes = {
  serverExists: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  serverExists: !allServerSelector(state).isEmpty()
});

export default connect(mapStateToProps)(LandingPage);
