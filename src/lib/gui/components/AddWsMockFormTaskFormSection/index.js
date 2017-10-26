import React from 'react';
import { Field, FormSection } from 'redux-form/immutable';

const AddWsMockFormTaskFormSection = () => (
  <div className="form-section">
    <header className="form-section__header">Message:</header>
    <FormSection name="params">
      <div className="form-row">
        <div className="form__field">
          <label className="form-field__label" htmlFor="payload">Message:</label>
          <Field component="textarea" name="message" />
        </div>
      </div>
    </FormSection>
    <FormSection name="schedule">
      <div className="form-row">
        <div className="form__field">
          <label className="form-field__label" htmlFor="delay">Delay:</label>
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
          <label className="form-field__label" htmlFor="interval">Interval:</label>
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

export default AddWsMockFormTaskFormSection;
