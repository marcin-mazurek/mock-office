import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddHttpMockForm } from '../../../../../../src/gui/components/AddHttpMockForm/index';

describe('HttpForm', () => {
  test('default snapshot', () => {
    const props = {
      queueId: 'some id',
      handleSubmit: () => {}
    };
    const wrapper = shallow(<AddHttpMockForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
