import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddDescription } from './AddDescription';

describe('AddDescription', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'some type'
    };
    const wrapper = shallow(<AddDescription {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
