import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Provider } from 'react-redux';
import NotificationsListConnect, { NotificationsList } from './NotificationsList';
import { Notification } from '../entities/notifications/createNotification';
import configureStore from '../store';

jest.mock('node-unique', () => () => 'id');

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
