import React from 'react';
import { Field, FormSection } from 'redux-form/immutable';

const ScenePartType = field =>
  <select onChange={field.input.onChange}>
    <option value="immediate">immediate</option>
    <option value="future">future</option>
  </select>;

export default class ScenePartFormSection extends FormSection {
  render() {
    return (
      <div>
        <div>
          <label htmlFor="title">title:</label>
          <Field component="input" name="title" type="text" />
        </div>
        <div>
          <label htmlFor="type">type:</label>
          <Field component={ScenePartType} name="type" />
        </div>
        <div>
          <label htmlFor="payload">Payload:</label>
          <Field component="textarea" name="payload" />
        </div>
        <div>
          <label htmlFor="type">Delay:</label>
          <Field component="input" type="number" name="type" />
        </div>
      </div>
    );
  }
}

ScenePartFormSection.defaultProps = {
  name: 'scenePart'
};
