import { connect } from 'react-redux';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AppError from '../entities/errors/AppError';
import { remove as createRemoveAction } from '../entities/errors/actions';
import { getErrors } from '../entities/errors/selectors';

export const ErrorList = ({ errors, remove }) =>
  <ul>
    {
      errors.map(error =>
        <li key={error.id}>
          {error.reason}
          <button onClick={() => remove(error.id)}>
            <i className="fa fa-close" />
          </button>
        </li>
      )
    }
  </ul>;

ErrorList.propTypes = {
  errors: ImmutablePropTypes.listOf(AppError),
  remove: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: getErrors(state)
});

const mapDispatchToProps = {
  remove: createRemoveAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorList);
