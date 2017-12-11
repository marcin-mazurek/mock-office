import React from 'react';
import { shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';

jest.doMock('cuid', () => () => 'id');
const { Notifications } = require('../');

describe('NotificationsList', () => {
  describe('snapshots', () => {
    test('without notifications', () => {
      const props = {
        notifications: [],
        onNotificationClick: () => {},
        onNewNotificationDisplayed: () => {}
      };
      const wrapper = shallow(<Notifications {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });

    test('with notification', () => {
      const notification = { id: 'id', message: 'message' };
      const props = {
        notifications: [notification],
        onNotificationClick: () => {},
        onNewNotificationDisplayed: () => {}
      };
      const wrapper = shallow(<Notifications {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });
  });
});
