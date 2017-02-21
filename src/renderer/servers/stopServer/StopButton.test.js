import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StopButton } from './StopButton';

test('StopButton should render', () => {
  const wrapper = shallow(<StopButton serverId="some id" stop={() => {}} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
