import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import configureStore from '../../../../../src/gui/configureStore';
import {
  NotificationsListConnect,
  NotificationsList
} from '../../../../../src/gui/components/NotificationsList/index';
import { addNotificationAction } from '../../../../../src/gui/app/notifications/index';

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
    expect(enzymeToJson(wrapper.find(NotificationsList))).toMatchSnapshot();
  });
});
