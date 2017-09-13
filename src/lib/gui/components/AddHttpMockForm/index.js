import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection } from 'redux-form/immutable';
import { connect } from 'react-redux';
import TaskFormSection from '../AddHttpMockTaskFormSection/index';

export const FORM_SUBMITTED = 'component/AddHttpMockForm/FORM_SUBMITTED';
export const formSubmittedAction = (server, scenario, values) => ({
  type: FORM_SUBMITTED,
  server,
  scenario,
  values
});

export const AddHttpMockForm = props => (
  <form className="form" onSubmit={props.handleSubmit}>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="title">Title:</label>
        <Field
          name="title"
          component="input"
          type="text"
          placeholder="Mock title"
          className="form-field__input"
        />
      </div>
    </div>
    <section className="form-section">
      <header className="form-section__header">Request:</header>
      <div className="form-row">
        <div className="form__field">
          <label className="form-field__label" htmlFor="requirements">Requirements:</label>
          <Field
            name="requirements"
            component="textarea"
            cols="30"
            rows="10"
          />
        </div>
      </div>
    </section>
    <section className="form-section">
      <header className="form-section__header">Response:</header>
      <FormSection name="task">
        <TaskFormSection />
      </FormSection>
      <div className="form-row">
        <button className="button form__button" type="submit">
          Submit
        </button>
      </div>
    </section>
  </form>
);

AddHttpMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(formSubmittedAction(ownProps.server, ownProps.scenario, values))
});

const AddHttpMockFormConnect = connect(null, mapDispatchToProps)(
  reduxForm(
    {
      form: 'addHttpMock',
      initialValues: {
        task: {
          type: 'immediate',
          params: {
            status: 200
          }
        }
      }
    }
  )(AddHttpMockForm)
);

export default AddHttpMockFormConnect;