import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { List } from 'immutable';
import { NotificationsList, Notification } from './NotificationsList';

storiesOf('Notifications', module)
  .add('single notification', () => {
    const notifications = new List([
      new Notification({
        id: '1',
        text: 'Hello I\'m info notification'
      })
    ]);
    return <NotificationsList notifications={notifications} remove={() => {}} />;
  })
  .add('multiple notification', () => {
    const notifications = new List([
      new Notification({
        id: '1',
        text: 'Hello I\'m info notification'
      }),
      new Notification({
        id: '2',
        text: 'Hello I\'m error notification!!!!',
        type: 'error'
      })
    ]);
    return <NotificationsList notifications={notifications} remove={() => {}} />;
  });
