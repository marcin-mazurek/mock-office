import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Queue from './Queue';

describe('Queue', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<Queue id="some-id" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
