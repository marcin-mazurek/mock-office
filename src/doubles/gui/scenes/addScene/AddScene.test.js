import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddScene } from './AddScene';

describe('AddScene', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'some type'
    };
    const wrapper = shallow(<AddScene {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
