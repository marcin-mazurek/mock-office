import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Provider } from 'react-redux';
import NotificationsListConnect, { NotificationsList } from '../../../src/gui/notifications/NotificationsList';
import { Notification } from '../../../src/gui/entities/notifications/createNotification';
import configureStore from '../../../src/gui/store/index';

jest.mock('cuid', () => () => 'id');

describe('NotificationsList', () => {
  test('snapshot: with notifications', () => {
    const notifications = new List([
      new Notification({ text: 'Something happened' })
    ]);
    const wrapper = shallow(<NotificationsList notifications={notifications} remove={() => {}} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('snapshot: empty', () => {
    const notifications = new List([]);
    const wrapper = shallow(<NotificationsList notifications={notifications} remove={() => {}} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('NotificationsListConnect', () => {
  test('snapshot: connected to store with notifications', () => {
    const store = configureStore();

    store.dispatch({
      type: 'notifications/ADD',
      notification: {
        text: 'text'
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <NotificationsListConnect />
      </Provider>
    );

    expect(toJson(wrapper.find(NotificationsList))).toMatchSnapshot();
  });
});
