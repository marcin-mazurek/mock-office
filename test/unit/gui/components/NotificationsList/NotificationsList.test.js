import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';
import enzymeToJson from 'enzyme-to-json';
import { NotificationsList } from '../../../../../src/gui/components/NotificationsList';
import { createNotification } from '../../../../../src/gui/app/notifications';

describe('NotificationsList', () => {
  describe('snapshots', () => {
    test('without notifications', () => {
      const props = {
        notifications: new List(),
        onNotificationClick: () => {},
        onNewNotificationDisplayed: () => {}
      };
      const wrapper = shallow(<NotificationsList {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });

    test('with notification', () => {
      const props = {
        notifications: new List([
          createNotification({ text: 'message' })
        ]),
        onNotificationClick: () => {},
        onNewNotificationDisplayed: () => {}
      };
      const wrapper = shallow(<NotificationsList {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });
  });
});
