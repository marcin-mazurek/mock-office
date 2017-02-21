import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddTask } from './AddTask';

test('AddTask should render', () => {
  const props = {
    serverType: 'some type'
  };
  const wrapper = shallow(<AddTask {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
