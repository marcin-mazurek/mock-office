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
    let formValues = values;
    let requirements;
    const requirementsDefaults = {
      event: 'RECEIVED_REQUEST'
    };

    try {
      const requirementsSubmitted = formValues.get('requirements');
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

    if (formValues.getIn(['scenePart', 'payload'])) {
      // temporary solution for parsing json payload from form
      // should be done within epic
      formValues = formValues.setIn(
        ['scenePart', 'payload'],
        JSON.parse(formValues.getIn(['scenePart', 'payload']))
      );
    }

    formValues = formValues.updateIn(['scenePart', 'delay'], (delay) => {
      if (!delay) {
        return delay;
      }

      return parseInt(delay, 10);
    });

    this.props.initAddScene(this.props.scenarioId, [
      {
        title: formValues.get('title'),
        requirements,
        parts: [
          formValues.get('scenePart').toJS()
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
