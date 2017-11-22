import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form/immutable';
import Select from 'react-select';
import ReactionFormSection from '../AddWsBehaviourFormReactionFormSection';
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
    <ul className="add-ws-behaviour-reactions-list">
      {
        fields.map((name, index) =>
          <li className="add-ws-behaviour-reactions-list__item" key={index}>
            <FormSection name={name}>
              <ReactionFormSection />
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
          />
        </div>
      </div>
    </div>
    <FormSection name="event">
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
      <header className="form-section__header">Messages:</header>
      <FieldArray component={renderMessages} name="reactions" />
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
      /* eslint-disable no-param-reassign */
      values = values.update('loadedCounter', (loadedCounter) => {
        if (!loadedCounter) {
          return 1;
        }

        return parseInt(loadedCounter, 10);
      });
      /* eslint-enable no-param-reassign */

      return values.toJS();
    },
    onSubmitSuccess(values, dispatch) {
      dispatch(submitSucceededAction(values));
    }
  }
)(AddBehaviourForm);
