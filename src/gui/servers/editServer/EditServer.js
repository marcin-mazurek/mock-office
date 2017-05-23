import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router';
import serverIcon from '../../assets/icons_gray_server.svg';
import { initAction } from './actions';
import { serverSelector } from '../../entities/servers/selectors';

export const EditServerForm = props =>
  <form className="form" action="#" onSubmit={props.handleSubmit}>
    <div className="form__header">
      <img className="form__header-icon" src={serverIcon} alt="" />
      Edit server
    </div>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="server-name">
          Name:
        </label>
        <Field
          component="input"
          className="form-field__input"
          name="name"
          type="text"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form__col">
        <div className="form__field">
          <label className="form-field__label" htmlFor="server-port">
            Port:
          </label>
          <Field
            component="input"
            className="form-field__input"
            name="port"
            type="text"
          />
        </div>
      </div>
    </div>
    <div className="form-row">
      <button
        className="button form__button"
        type="submit"
      >
        Save
      </button>
      <Link
        to={`/server/${props.serverId}`}
        className="button form__button"
      >
        Cancel
      </Link>
    </div>
  </form>;

EditServerForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  serverId: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(initAction(ownProps.serverId, values.toJS()))
});

const mapStateToProps = (state, ownProps) => {
  const server = serverSelector(state, ownProps.serverId);

  return {
    initialValues: {
      name: server.name,
      port: server.port
    }
  };
};

export const EditServerFormConnect = connect(mapStateToProps, mapDispatchToProps)(
  reduxForm(
    {
      form: 'editServer'
    }
  )(EditServerForm)
);

const EditServerPage = props => (
  <div className="edit-server-page">
    <Scrollbars>
      <div className="edit-server-page__form">
        <EditServerFormConnect serverId={props.params.id} />
      </div>
    </Scrollbars>
  </div>
);

EditServerPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};

export default EditServerPage;
