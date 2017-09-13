import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/immutable';
import AddServerForm from './AddServerForm';
import { submitButtonClickAction } from './actions';

const FORM_NAME = 'addServer';
const INITIAL_VALUES = {
  name: 'Awesome server',
  port: 3000,
  type: 'http',
  secure: false
};
const mapDispatchToProps = {
  onSubmit: submitButtonClickAction
};

export default connect(null, mapDispatchToProps)(
  reduxForm({
    form: FORM_NAME,
    initialValues: INITIAL_VALUES
  })(AddServerForm)
);
