import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from '../../../../../src/lib/gui/app/configureStore';
import {
  NotificationsListConnect,
  NotificationsList,
  NotificationListItem
} from '../../../../../src/lib/gui/components/NotificationsList';
import { addNotificationAction } from '../../../../../src/lib/gui/app/notifications';

describe('NotificationsList', () => {
  test('should display notifications from redux store', () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <NotificationsListConnect />
      </Provider>
    );

    expect(wrapper.find(NotificationsList).exists()).toBeTruthy();
    store.dispatch(
      addNotificationAction({
        text: 'message'
      })
    );
    expect(wrapper.find(NotificationListItem)).toHaveLength(1);
  });
});
