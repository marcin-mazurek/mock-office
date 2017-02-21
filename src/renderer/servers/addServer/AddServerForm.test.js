import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddServerForm } from './AddServerForm';

test('AddServerForm should render', () => {
  const wrapper = shallow(<AddServerForm add={() => {}} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
