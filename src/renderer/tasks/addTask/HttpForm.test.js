import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HttpForm } from './HttpForm';

test('HttpForm should render', () => {
  const props = {
    initAddTask: () => {},
    queueId: 'some id'
  };
  const wrapper = shallow(<HttpForm {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
