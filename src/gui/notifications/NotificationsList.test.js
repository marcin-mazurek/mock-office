import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { NotificationsList } from './NotificationsList';
import { Notification } from '../entities/notifications/createNotification';

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
