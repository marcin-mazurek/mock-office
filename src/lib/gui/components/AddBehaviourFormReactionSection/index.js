import React from 'react';
import { Field, FormSection } from 'redux-form/immutable';
import Select from 'react-select';

const ReactionTypeField = field =>
  <Select
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'message', label: 'message' },
      { value: 'connect', label: 'connect' },
      { value: 'response', label: 'response' }
    ]}
  />;

const AddBehaviourReactionSection = () => (
  <div className="form-section">
    <header className="form-section__header">Reaction:</header>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="type">Type:</label>
        <Field
          className="form-field__textarea"
          component={ReactionTypeField}
          name="type"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="params">Params:</label>
        <Field
          className="form-field__textarea"
          name="params"
          component="textarea"
          cols="30"
          rows="5"
        />
      </div>
    </div>
    <FormSection name="schedule">
      <div className="form-row">
        <div className="form__field">
          <label className="form-field__label" htmlFor="delay">Delay(ms):</label>
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
          <label className="form-field__label" htmlFor="interval">Interval(ms):</label>
          <Field
            className="form-field__input"
            component="input"
            type="number"
            name="interval"
          />
        </div>
      </div>
    </FormSection>
  </div>
);

export default AddBehaviourReactionSection;
