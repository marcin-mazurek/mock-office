import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import AddServer from './AddServerPage';

describe('AddServer', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<AddServer />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
