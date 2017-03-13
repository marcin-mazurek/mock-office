import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StartButton } from './StartButton';

describe('StartButton', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<StartButton serverId="some id" start={() => {}} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
