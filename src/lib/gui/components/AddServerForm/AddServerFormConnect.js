import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import AddServerForm from './AddServerForm';
import { submitButtonClickAction } from './actions';

const FORM_NAME = 'addServer';
const INITIAL_VALUES = {
  name: 'Awesome server',
  port: 3000,
  type: 'http'
};
const selector = formValueSelector(FORM_NAME);
const mapDispatchToProps = {
  onSubmit: submitButtonClickAction
};

export default connect(state => ({
  serverType: selector(state, 'type')
}), mapDispatchToProps)(
  reduxForm({
    form: FORM_NAME,
    initialValues: INITIAL_VALUES
  })(AddServerForm)
);
