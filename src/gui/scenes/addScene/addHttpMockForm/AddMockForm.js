import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, FormSection } from 'redux-form/immutable';
import { connect } from 'react-redux';
import ScenePartFormSection from '../ScenePartFormSection';
import { submitHttpScene } from './addSceneEpic';

export const AddMockForm = props => (
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
    <section className="form-section">
      <header className="form-section__header">Request:</header>
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
      <header className="form-section__header">Response:</header>
      <FormSection name="scenePart">
        <ScenePartFormSection />
      </FormSection>
      <div className="form-row">
        <button className="button form__button" type="submit">
          Submit
        </button>
      </div>
    </section>
  </form>
);

AddMockForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(submitHttpScene(ownProps.scenarioId, values.toJS()))
});

export default connect(null, mapDispatchToProps)(
  reduxForm(
    {
      form: 'httpMock',
      initialValues: {
        scenePart: {
          type: 'immediate'
        }
      }
    }
  )(AddMockForm)
);
