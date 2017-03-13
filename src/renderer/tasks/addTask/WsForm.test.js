import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { WsForm } from './WsForm';

describe('WsForm', () => {
  test('default snapshot', () => {
    const props = {
      initAddTask: () => {},
      queueId: 'some id'
    };
    const wrapper = shallow(<WsForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
