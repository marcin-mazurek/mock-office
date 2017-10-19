import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection } from 'redux-form/immutable';
import Select from 'react-select';
import { submitSucceededAction } from './actions';

const MethodField = field =>
  <Select
    name="method"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' },
      { value: 'UPDATE', label: 'UPDATE' }
    ]}
  />;

export const AddHttpMockForm = ({ handleSubmit }) => {
  return (
    <form className="add-http-mock-form form" onSubmit={handleSubmit}>
      <FormSection name="request">
        <section className="form-section">
          <header className="form-section__header">Request:</header>
          <div className="form-row">
            <div className="form__field">
              <label className="form-field__label" htmlFor="path">Path:</label>
              <Field
                className="form-field__input"
                name="path"
                component="input"
                type="text"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form__field">
              <label className="form-field__label" htmlFor="method">Method:</label>
              <Field
                name="method"
                component={MethodField}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form__field">
              <label className="form-field__label" htmlFor="payload">Payload:</label>
              <Field
                className="form-field__textarea"
                name="payload"
                component="textarea"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form__field">
              <label className="form-field__label" htmlFor="headers">Headers:</label>
              <Field
                className="form-field__textarea"
                name="headers"
                component="textarea"
              />
            </div>
          </div>
        </section>
      </FormSection>
      <FormSection name="response">
        <FormSection name="params">
          <section className="form-section">
            <header className="form-section__header">Response:</header>
            <div className="form-row">
              <div className="form__field">
                <label className="form-field__label" htmlFor="payload">Payload:</label>
                <Field
                  className="form-field__textarea"
                  component="textarea"
                  name="payload"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form__field">
                <label className="form-field__label" htmlFor="payload">Headers:</label>
                <Field
                  component="textarea"
                  name="headers"
                  className="form-field__textarea"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form__field">
                <label className="form-field__label" htmlFor="status">Status code:</label>
                <Field
                  className="form-field__input"
                  component="input"
                  type="number"
                  name="status"
                />
              </div>
            </div>
          </section>
        </FormSection>
        <FormSection name="schedule">
          <section className="form-section">
            <div className="form-row">
              <div className="form__field">
                <label className="form-field__label" htmlFor="delay">Response delay:</label>
                <Field
                  className="form-field__input"
                  component="input"
                  type="number"
                  name="delay"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form__field">
                <label className="form-field__label" htmlFor="loadedCounter">
                  How many times do you want to use it:
                </label>
                <Field
                  className="form-field__input"
                  component="input"
                  type="number"
                  name="loadedCounter"
                />
              </div>
            </div>
          </section>
        </FormSection>
      </FormSection>
      <div className="form-row">
        <button className="button form__button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

AddHttpMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm(
  {
    form: 'addHttpMock',
    onSubmit(values) {
      return values.set('loadedCounter', parseInt(values.get('loadedCounter'), 10)).toJS();
    },
    onSubmitSuccess(values, dispatch) {
      dispatch(submitSucceededAction(values));
    }
  }
)(AddHttpMockForm);
