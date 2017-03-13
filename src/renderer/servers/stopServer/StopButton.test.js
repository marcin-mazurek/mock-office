import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StopButton } from './StopButton';

describe('StopButton', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<StopButton serverId="some id" stop={() => {}} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
