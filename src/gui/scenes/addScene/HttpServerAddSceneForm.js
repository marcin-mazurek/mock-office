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
    const requirementsDefaults = {
      event: 'RECEIVED_REQUEST'
    };

    try {
      const requirementsSubmitted = values.get('requirements');
      if (requirementsSubmitted) {
        requirements = JSON.parse(requirementsSubmitted);
        requirements = Object.assign(requirementsDefaults, requirements);
      } else {
        requirements = requirementsDefaults;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    if (values.getIn(['scenePart', 'payload'])) {
      // temporary solution for parsing json payload fro form
      // should be done within epic
      // eslint-disable-next-line no-param-reassign
      values = values.setIn(
        ['scenePart', 'payload'],
        JSON.parse(values.getIn(['scenePart', 'payload']))
      );
    }

    this.props.initAddScene(this.props.scenarioId, [
      {
        title: values.get('title'),
        requirements,
        parts: [
          values.get('scenePart')
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
