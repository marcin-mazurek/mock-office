import { connect } from 'react-redux';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AppError from '../entities/errors/AppError';

export const ErrorList = ({ errors }) =>
  <ul>
    {
      errors.map(error =>
        <li key={error.id}>{error.reason}</li>
      )
    }
  </ul>;

ErrorList.propTypes = {
  errors: ImmutablePropTypes.listOf(AppError)
};

const mapStateToProps = state => ({
  errors: state.get('errors')
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorList);
