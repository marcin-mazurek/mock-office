import React from 'react';
import { Field } from 'redux-form/immutable';

const ScenePartType = field =>
  <select onChange={field.input.onChange}>
    <option value="immediate">immediate</option>
    <option value="future">future</option>
  </select>;

const ScenePartFormSection = () => (
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
      <label htmlFor="delay">Delay:</label>
      <Field component="input" type="number" name="delay" />
    </div>
  </div>
);

export default ScenePartFormSection;
