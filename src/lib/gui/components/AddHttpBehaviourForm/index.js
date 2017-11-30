import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form/immutable';
import Select from 'react-select';
import { submitSucceededAction } from './actions';
import { paramsSelector } from '../../app/addBehaviour/selectors';

// eslint-disable-next-line react/prop-types
const renderReactions = ({ fields }) => (
  <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
    {
      fields.map((name, index) => (
        <li key={index} style={{ padding: '0', margin: '0' }}>
          <FormSection name={name}>
            <header className="form-section__header">Reactions:</header>
            <FormSection name="params">
              <div className="form-row">
                <div className="form__field">
                  <label className="form-field__label" htmlFor="payload">Payload:</label>
                  <Field
                    className="form-field__textarea"
                    component="textarea"
                    name="payload"
                  />message
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
                    normalize={value => parseInt(value, 10)}
                  />
                </div>
              </div>
            </FormSection>
            <FormSection name="schedule">
              <div className="form-row">
                <div className="form__field">
                  <label className="form-field__label" htmlFor="delay">Delay(ms):</label>
                  <Field
                    className="form-field__input"
                    component="input"
                    type="number"
                    name="delay"
                    normalize={value => parseInt(value, 10)}
                  />
                </div>
              </div>
            </FormSection>
          </FormSection>
        </li>
      ))
    }
  </ul>
);

const EventTypeField = field =>
  <Select
    name="type"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'request', label: 'request' }
    ]}
  />;

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

export const AddHttpBehaviourForm = ({ handleSubmit }) => (
  <form className="add-http-behaviour-form form" onSubmit={handleSubmit}>
    <section className="form-section">
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
            normalize={value => parseInt(value, 10)}
          />
        </div>
      </div>
    </section>
    <section className="form-section">
      <header className="form-section__header">Event:</header>
      <FormSection name="event">
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="method">Event type:</label>
            <Field component={EventTypeField} />
          </div>
        </div>
        <FormSection name="params">
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
              <Field component={MethodField} />
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
        </FormSection>
      </FormSection>
    </section>

    <section className="form-section">
      <FieldArray component={renderReactions} name="reactions" />
      <div className="form-row">
        <button className="button form__button" type="submit">
          Submit
        </button>
      </div>
    </section>
  </form>
);

AddHttpBehaviourForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({
    serverId: paramsSelector(state).get('serverId')
  })
)(
  reduxForm(
    {
      form: 'addHttpBehaviour',
      initialValues: {
        event: {
          type: 'request'
        },
        reactions: [{
          type: 'response'
        }]
      },
      onSubmit(values) {
        return values.toJS();
      },
      onSubmitSuccess(values, dispatch, props) {
        dispatch(submitSucceededAction(values, props.serverId));
      }
    }
  )(AddHttpBehaviourForm)
);
