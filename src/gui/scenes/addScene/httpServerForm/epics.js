import { init } from '../actions';
import { SUBMIT_HTTP_SCENE } from './actions';

export default action$ =>
  action$.ofType(SUBMIT_HTTP_SCENE)
    .map((action) => {
      let formValues = action.formValues;
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

      return init(action.scenarioId, [
        {
          title: formValues.get('title'),
          requirements,
          parts: [
            formValues.get('scenePart').toJS()
          ]
        }
      ]);
    });
