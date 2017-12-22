import React from 'react';
import { shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import Notification from '../lib/Notification';

describe('Notification', () => {
  test('with mood', () => {
    const props = { id: 'id', message: 'message', mood: 'positive', onNotificationClick: () => {} };
    const wrapper = shallow(<Notification {...props} />);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});
