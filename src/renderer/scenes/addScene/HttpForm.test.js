import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HttpForm } from './HttpForm';

describe('HttpForm', () => {
  test('default snapshot', () => {
    const props = {
      initAddScene: () => {},
      queueId: 'some id'
    };
    const wrapper = shallow(<HttpForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
