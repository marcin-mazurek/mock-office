import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@kadira/storybook';
import TaskListConnect from '../src/lib/gui/components/TaskList';
import configureStore from '../src/lib/gui/app/configureStore';
import { succeededAction } from '../src/lib/gui/epics/importMock/index';
import { succeededAction as addServerSucceded } from '../src/lib/gui/epics/addServer/actions';

storiesOf('TaskList', module)
  .add('default', () => {
    const store = configureStore();
    store.dispatch(
      addServerSucceded({
        data: {
          name: 'Awesome server',
          port: 3000,
          type: 'http',
          secure: false,
          scenario: 'scenario-id',
          running: false,
          id: 'server-id'
        }
      })
    );
    store.dispatch(
      succeededAction(
        'scenario-id',
        [
          {
            id: 'mock-id-1',
            quantity: 0,
            tasks: [
              {
                id: 'task-id-1',
                title: 'task 1',
                type: 'future',
                payload: {}
              },
              {
                id: 'task-id-2',
                title: 'task 2',
                type: 'future',
                payload: {},
                delay: 500
              }
            ],
            title: 'Mock',
            requirements: {
              event: 'RECEIVED_REQUEST',
              url: '/bet/slips/S00001067bec2425c4/?sortOrder=off'
            }
          }
        ]
      )
    );

    return (
      <Provider store={store}>
        <TaskListConnect mock="mock-id-1" />
      </Provider>
    );
  });
