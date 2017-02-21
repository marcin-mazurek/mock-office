import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Main from './Main';

test('Main should render', () => {
  const wrapper = shallow(<Main />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
