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
      let notification = createNotification({ text: 'message' });
      notification = notification.set('id', 'some-id');
      const props = {
        notifications: new List([
          notification
        ]),
        onNotificationClick: () => {},
        onNewNotificationDisplayed: () => {}
      };
      const wrapper = shallow(<NotificationsList {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });
  });
});
