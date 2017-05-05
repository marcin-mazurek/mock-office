import React from 'react';
import Select from 'react-select';
import { Field } from 'redux-form/immutable';

const TaskType = field =>
  <Select
    name="server-type"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'immediate', label: 'immediate' },
      { value: 'future', label: 'future' }
    ]}
  />
;

const TaskFormSection = () => (
  <div style={{ width: '100%' }}>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="title">Title:</label>
        <Field
          className="form-field__input"
          component="input"
          name="title"
          type="text"
          placeholder="task title"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="type">Type:</label>
        <Field component={TaskType} name="type" />
      </div>
    </div>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="payload">Payload:</label>
        <Field component="textarea" name="payload" />
      </div>
    </div>
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
  </div>
);

export default TaskFormSection;
