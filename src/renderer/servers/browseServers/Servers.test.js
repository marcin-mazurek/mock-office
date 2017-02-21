import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Servers from './Servers';

test('Servers should render', () => {
  const wrapper = shallow(<Servers />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
