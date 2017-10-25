import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form/immutable';
import Select from 'react-select';
import TaskFormSection from '../AddWsMockFormTaskFormSection';
import { submitSucceededAction } from './actions';

const EventTypeField = field =>
  <Select
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'message', label: 'on message' },
      { value: 'connect', label: 'on connect' }
    ]}
  />;
// eslint-disable-next-line react/prop-types
const renderMessages = ({ fields }) =>
  <div>
    <ul className="add-ws-mock-tasks-list">
      {
        fields.map((name, index) =>
          <li className="add-ws-mock-tasks-list__item" key={index}>
            <FormSection name={name}>
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
    <FormSection name="trigger">
      <section className="form-section">
        <header className="form-section__header">Trigger:</header>
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="event">Event type:</label>
            <Field
              name="event"
              component={EventTypeField}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="trigger.params">Params:</label>
            <Field
              name="params"
              component="textarea"
              cols="30"
              rows="10"
            />
          </div>
        </div>
      </section>
    </FormSection>
    <section className="form-section">
      <header className="form-section__header">Messages:</header>
      <FieldArray component={renderMessages} name="messages" />
    </section>
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
    <div className="form-row">
      <button className="button form__button" type="submit">
        Submit
      </button>
    </div>
  </form>;

AddMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm(
  {
    form: 'addWsMock',
    initialValues: {
      messages: [{}]
    },
    onSubmit(values) {
      return values.set('loadedCounter', parseInt(values.get('loadedCounter'), 10)).toJS();
    },
    onSubmitSuccess(values, dispatch) {
      dispatch(submitSucceededAction(values));
    }
  }
)(AddMockForm);
