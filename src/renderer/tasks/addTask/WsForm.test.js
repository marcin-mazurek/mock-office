import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { WsForm } from './WsForm';

test('WsForm should render', () => {
  const props = {
    initAddTask: () => {},
    serverId: 'some id'
  };
  const wrapper = shallow(<WsForm {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
