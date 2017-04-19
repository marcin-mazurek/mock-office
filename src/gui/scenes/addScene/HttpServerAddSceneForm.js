import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReduxHttpForm from './HttpForm';
import { init as initAddScene } from './actions';
import { getSelectedServerDetails } from '../../entities/servers/selectors';

export class HttpServerAddSceneForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    let requirements;

    try {
      if (values.requirements) {
        requirements = JSON.parse(values.requirements);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    if (values.scenePart) {
      // temporary solution for parsing json payload fro form
      // should be done within epic
      // eslint-disable-next-line no-param-reassign
      values.scenePart.payload = JSON.parse(values.scenePart.payload);
    }

    this.props.initAddScene(this.props.scenarioId, [
      {
        requirements,
        parts: [
          values.scenePart
        ]
      }
    ]);
  }

  render() {
    return <ReduxHttpForm onSubmit={this.handleSubmit} />;
  }
}

HttpServerAddSceneForm.propTypes = {
  initAddScene: PropTypes.func.isRequired,
  scenarioId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  scenarioId: getSelectedServerDetails(state).id
});

const mapDispatchToProps = {
  initAddScene
};

export default connect(mapStateToProps, mapDispatchToProps)(HttpServerAddSceneForm);
