import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector, FormSection } from 'redux-form/immutable';
import { connect } from 'react-redux';
import ScenePartFormSection from '../ScenePartFormSection';
import { submitHttpScene as createSubmitHttpSceneAction } from './actions';

export const HttpForm = props => (
  <form onSubmit={props.handleSubmit}>
    <div>
      <label htmlFor="title">Title:</label>
      <Field name="title" component="input" type="text" placeholder="Scene title" />
    </div>
    <div>
      <div>
        <label htmlFor="requirements">Requirements:</label>
        <Field name="requirements-check" component="input" type="checkbox" />
      </div>
      <Field
        name="requirements"
        component="textarea"
        cols="30"
        rows="10"
      />
    </div>
    <div>
      <label htmlFor="part">Send:</label>
      <div>
        <FormSection name="scenePart">
          <ScenePartFormSection />
        </FormSection>
      </div>
    </div>
    <div>
      <button className="button" type="submit">
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
