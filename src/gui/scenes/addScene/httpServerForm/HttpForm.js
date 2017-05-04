import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector, FormSection } from 'redux-form/immutable';
import { connect } from 'react-redux';
import ScenePartFormSection from '../ScenePartFormSection';
import { submitHttpScene as createSubmitHttpSceneAction } from './actions';

export const HttpForm = props => (
  <form className="form" onSubmit={props.handleSubmit}>
    <div className="form__header">
      Add scene
    </div>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="title">Title:</label>
        <Field
          name="title"
          component="input"
          type="text"
          placeholder="Scene title"
          className="form-field__input"
        />
      </div>
    </div>
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
    <div>Part:</div>
    <FormSection name="scenePart">
      <ScenePartFormSection />
    </FormSection>
    <div className="form-row">
      <button className="button form__button" type="submit">
        Submit
      </button>
    </div>
  </form>
);

HttpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

HttpForm.defaultPropTypes = {
  needRequirements: false
};

const selector = formValueSelector('httpServerScene');

const mapStateToProps = state => ({
  needRequirements: selector(state, 'type')
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(createSubmitHttpSceneAction(ownProps.scenarioId, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm(
    {
      form: 'httpServerScene',
      initialValues: {
        scenePart: {
          type: 'immediate'
        }
      }
    }
  )(HttpForm)
);
