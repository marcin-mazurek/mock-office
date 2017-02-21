import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Queue from './Queue';

test('Queue should render', () => {
  const wrapper = shallow(<Queue id="some-id" />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
