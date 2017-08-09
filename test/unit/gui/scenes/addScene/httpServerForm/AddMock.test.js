import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddMockForm } from '../../../../../../src/gui/mocks/addMock/addHttpMock/AddMockForm';

describe('HttpForm', () => {
  test('default snapshot', () => {
    const props = {
      queueId: 'some id',
      handleSubmit: () => {}
    };
    const wrapper = shallow(<AddMockForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
