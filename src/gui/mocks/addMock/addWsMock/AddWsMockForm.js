import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection } from 'redux-form/immutable';
import { connect } from 'react-redux';
import Select from 'react-select';
import TaskFormSection from './TaskFormSection';
import { submit } from './epic';

const EventTypeField = field =>
  <Select
    name="eventType"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'RECEIVED_MESSAGE', label: 'on message' },
      { value: 'CLIENT_CONNECTED', label: 'on connect' }
    ]}
  />
;

export const AddMockForm = props => (
  <form className="form" onSubmit={props.handleSubmit}>
    <div className="form__header">
      Add mock
    </div>
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
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="eventType">Event type:</label>
        <Field
          name="event"
          component={EventTypeField}
        />
      </div>
    </div>
    <section className="form-section">
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
      <header className="form-section__header">Message:</header>
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

AddMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(submit(ownProps.scenarioId, values.toJS()))
});

export default connect(null, mapDispatchToProps)(
  reduxForm(
    {
      form: 'addWsMock',
      initialValues: {
        event: 'RECEIVED_MESSAGE',
        task: {
          type: 'immediate'
        }
      }
    }
  )(AddMockForm)
);
