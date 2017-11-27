import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form/immutable';
import Select from 'react-select';
import ReactionSection from '../AddBehaviourFormReactionSection';
import { submitSucceededAction } from './actions';

const EventTypeField = field =>
  <Select
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'message', label: 'message' },
      { value: 'connect', label: 'connect' },
      { value: 'request', label: 'request' }
    ]}
  />;
// eslint-disable-next-line react/prop-types
const renderReactionSections = ({ fields }) =>
  <div>
    <div>
      {
        fields.map((name, index) =>
          <div className="form-section" key={index}>
            <FormSection name={name}>
              <ReactionSection />
            </FormSection>
          </div>
        )
      }
    </div>
    <button
      type="button"
      className="button form__button"
      onClick={() => fields.push({})}
    >
      Add message
    </button>
  </div>;

export const AddBehaviourForm = props =>
  <form className="form" onSubmit={props.handleSubmit}>
    <div className="form-section">
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
    </div>
    <FormSection name="event">
      <section className="form-section">
        <header className="form-section__header">Event:</header>
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="event">Event type:</label>
            <Field name="type" component={EventTypeField} />
          </div>
        </div>
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="trigger.params">Params:</label>
            <Field
              className="form-field__textarea"
              name="params"
              component="textarea"
              cols="30"
              rows="5"
            />
          </div>
        </div>
      </section>
    </FormSection>
    <section className="form-section">
      <header className="form-section__header">Reactions:</header>
      <FieldArray component={renderReactionSections} name="reactions" />
    </section>
    <div className="form-row">
      <button className="button form__button" type="submit">
        Submit
      </button>
    </div>
  </form>;

AddBehaviourForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm(
  {
    form: 'addWsBehaviour',
    initialValues: {
      reactions: [{}]
    },
    onSubmit(values) {
      return values.toJS();
    },
    onSubmitSuccess(values, dispatch, props) {
      dispatch(submitSucceededAction(values, props.serverId));
    }
  }
)(AddBehaviourForm);
