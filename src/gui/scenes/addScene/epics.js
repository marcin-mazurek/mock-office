import { Observable } from 'rxjs';
import { INIT, add, init, SUBMIT_HTTP_SCENE } from './actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;

      return Observable.from(Promise.all(
        scenes.map(scene =>
          fetch('http://127.0.0.1:3060/add-scene', {
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ serverId, scene })
          })
            .then(res => res.json())
            .then(
              res => [
                serverId,
                res.id,
                scene.title,
                scene.interval,
                scene.reuse,
                scene.quantity,
                scene.delay,
                scene.requirements,
                scene.parts.map((part, index) => {
                  // eslint-disable-next-line no-param-reassign
                  part.id = res.parts[index];
                  return part;
                })
              ]
            )
        )
      ));
    })
    .flatMap(scenes => Observable.from(scenes))
    .map(scene => add(...scene));

export default addSceneEpic;

export const submitHttpSceneEpic = action$ =>
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
