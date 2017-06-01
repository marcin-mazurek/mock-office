import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form/immutable';
import { connect } from 'react-redux';
import Select from 'react-select';
import TaskFormSection from './TaskFormSection';

export const FORM_SUBMITTED = 'component/AddWsMockForm/FORM_SUBMITTED';
export const formSubmittedAction = (server, scenario, values) => ({
  type: FORM_SUBMITTED,
  server,
  scenario,
  values
});

const EventTypeField = field =>
  <Select
    name="event"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'RECEIVED_MESSAGE', label: 'on message' },
      { value: 'CLIENT_CONNECTED', label: 'on connect' }
    ]}
  />;
// eslint-disable-next-line react/prop-types
const renderTasks = ({ fields }) =>
  <div>
    <ul className="add-ws-mock-tasks-list">
      {
        fields.map((field, index) =>
          <li className="add-ws-mock-tasks-list__item" key={index}>
            <FormSection name={field}>
              <TaskFormSection />
            </FormSection>
          </li>
        )
      }
    </ul>
    <button
      type="button"
      className="button form__button"
      onClick={() => fields.push({})}
    >
      Add message
    </button>
  </div>;

export const AddMockForm = props =>
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
      <FieldArray component={renderTasks} name="tasks" />
    </section>
    <div className="form-row">
      <button className="button form__button" type="submit">
        Submit
      </button>
    </div>
  </form>;

AddMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(formSubmittedAction(ownProps.server, ownProps.scenario, values))
});

export default connect(null, mapDispatchToProps)(
  reduxForm(
    {
      form: 'addWsMock',
      initialValues: {
        event: 'RECEIVED_MESSAGE',
        tasks: [{}]
      }
    }
  )(AddMockForm)
);
