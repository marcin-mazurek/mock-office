import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReduxHttpForm from './HttpForm';
import { submitHttpScene } from './actions';
import { getSelectedServerDetails } from '../../entities/servers/selectors';

export class HttpServerAddSceneForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.submitHttpScene(this.props.scenarioId, values);
  }

  render() {
    return <ReduxHttpForm onSubmit={this.handleSubmit} />;
  }
}

HttpServerAddSceneForm.propTypes = {
  submitHttpScene: PropTypes.func.isRequired,
  scenarioId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  scenarioId: getSelectedServerDetails(state).id
});

const mapDispatchToProps = {
  submitHttpScene
};

export default connect(mapStateToProps, mapDispatchToProps)(HttpServerAddSceneForm);
