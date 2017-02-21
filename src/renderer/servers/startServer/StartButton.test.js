import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StartButton } from './StartButton';

test('StartButton should render', () => {
  const wrapper = shallow(<StartButton serverId="some id" start={() => {}} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
