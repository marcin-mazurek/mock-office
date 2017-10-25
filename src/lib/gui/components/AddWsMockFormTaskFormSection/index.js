import React from 'react';
import { Field } from 'redux-form/immutable';
import { FormSection } from 'redux-form';

const AddWsMockFormTaskFormSection = () => (
  <div className="form-section">
    <header className="form-section__header">Message:</header>
    <FormSection name="params">
      <div className="form-row">
        <div className="form__field">
          <label className="form-field__label" htmlFor="payload">Payload:</label>
          <Field component="textarea" name="payload" />
        </div>
      </div>
    </FormSection>
    <div className="form-row">
      <FormSection name="schedule">
        <div className="form__field">
          <label className="form-field__label" htmlFor="delay">Delay:</label>
          <Field
            className="form-field__input"
            component="input"
            type="number"
            name="delay"
          />
        </div>
      </FormSection>
    </div>
  </div>
);

export default AddWsMockFormTaskFormSection;
