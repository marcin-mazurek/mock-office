import { Observable } from 'rxjs';
import api from '../../../api';
import { add as addNotification } from '../../../entities/notifications/actions';
import { add } from '../../../entities/mocks/actions';
import { add as addTask } from '../../../entities/tasks/actions';

export const SUBMIT = 'addWsMock/SUBMIT';

export const submit = (scenarioId, formValues) => ({
  type: SUBMIT,
  scenarioId,
  formValues
});

const processFormValues = (formValues) => {
  let error;
  const fV = formValues;
  let requirements;

  const requirementsSubmitted = fV.requirements;
  if (requirementsSubmitted) {
    try {
      requirements = JSON.parse(requirementsSubmitted);
    } catch (e) {
      throw new Error('Requirements JSON is broken');
    }
    requirements = Object.assign({}, requirements);
  } else {
    requirements = {};
  }

  Object.assign(requirements, { event: fV.event });

  fV.tasks.forEach((task) => {
    /* eslint-disable no-param-reassign */
    if (error) {
      return;
    }

    if (task && task.payload) {
      try {
        task.payload = JSON.parse(task.payload);
      } catch (err) {
        error = { message: 'Payload JSON is broken' };
      }
    }

    if (task.delay) {
      if (task.delay < 0) {
        error = { message: 'Delay is < 0' };
      }

      task.delay = parseInt(task.delay, 10);
      /* eslint-enable no-param-reassign */
    }
  });

  if (error) {
    return error;
  }

  return {
    data: {
      title: fV.title,
      requirements,
      tasks: fV.tasks
    }
  };
};

export default function addWsMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      try {
        const { data, error } = processFormValues(action.formValues);

        if (error) {
          return Observable.of(addNotification({ text: error.message, type: 'error' }));
        }

        const reqWithEvent = Object.assign({}, data.requirements, { event: 'RECEIVED_REQUEST' });

        return Observable.from(
          api.addMock(action.server, action.scenario, Object.assign(data,
            {
              requirements: reqWithEvent
            }
          ))
            .then(result => ({
              id: result.id,
              params: {
                title: data.title,
                interval: data.interval,
                reuse: data.reuse,
                quantity: data.quantity,
                delay: data.delay,
                requirements: reqWithEvent,
                tasks: data.tasks.map((task, index) => {
                  // eslint-disable-next-line no-param-reassign
                  task.id = result.tasks[index];
                  return task;
                })
              }
            }))
        )
          .flatMap((result) => {
            const actions = [];

            actions.push(add(action.scenario, result.id,
              // add mock action needs only ids of tasks
              Object.assign(
                {},
                result.params,
                { tasks: result.params.tasks.map(task => task.id) }
              )
            ));
            result.params.tasks.forEach(task =>
              // add task action uses original full params object
              actions.push(addTask(result.id, task.id, task))
            );

            return actions;
          });
      } catch (error) {
        return Observable.of(addNotification({ text: error.message, type: 'error' }));
      }
    });
}
