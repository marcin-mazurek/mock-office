import { Observable } from 'rxjs';
import api from '../../../resources/api';
import { addAction as addNotification } from '../../../notifications/actions';
import { actionCreators } from '../../../entities/module';
import { SUBMIT } from './actions';

const processFormValues = (formValues) => {
  const fV = formValues;
  let requirements;

  const requirementsSubmitted = fV.requirements;
  if (requirementsSubmitted) {
    try {
      requirements = JSON.parse(requirementsSubmitted);
    } catch (error) {
      throw new Error('Requirements JSON is broken');
    }
    requirements = Object.assign({}, requirements);
  } else {
    requirements = {};
  }

  if (fV.task && fV.task.payload) {
    try {
      fV.task.payload = JSON.parse(fV.task.payload);
    } catch (error) {
      throw new Error('Payload JSON is broken');
    }
  }

  if (fV.task.delay) {
    if (fV.task.delay < 0) {
      return {
        error: {
          message: 'Delay is < 0'
        }
      };
    }

    fV.task.delay = parseInt(fV.task.delay, 10);
  }

  return {
    data: {
      title: fV.title,
      requirements,
      tasks: [fV.task]
    }
  };
};

export default function addMockEpic(action$) {
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
              id: result.data.id,
              params: {
                title: data.title,
                interval: data.interval,
                reuse: data.reuse,
                quantity: data.quantity,
                delay: data.delay,
                requirements: reqWithEvent,
                tasks: data.tasks.map((task, index) => {
                  // eslint-disable-next-line no-param-reassign
                  task.id = result.data.tasks[index];
                  return task;
                })
              }
            }))
        )
          .flatMap((result) => {
            const actions = [];

            actions.push(actionCreators.addMockAction(action.scenario, result.id,
              // addAction mock action needs only ids of tasks
              Object.assign(
                {},
                result.params,
                { tasks: result.params.tasks.map(task => task.id) }
              )
            ));
            result.params.tasks.forEach(task =>
              // addAction task action uses original full params object
              actions.push(actionCreators.addServerAction(result.id, task.id, task))
            );

            return actions;
          });
      } catch (error) {
        return Observable.of(addNotification({ text: error.message, type: 'error' }));
      }
    });
}
