import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Server } from './Server';

test('Server should render', () => {
  const props = {
    running: true,
    serverDetails: {
      name: 'some id',
      type: 'some type',
      port: 3000,
      queue: 'some queue id',
      id: 'some id'
    }
  };
  const wrapper = shallow(<Server {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
