import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FilePicker } from './FilePicker';

test('FilePicker should render', () => {
  const props = {
    initAddQueueFromFile: () => {}
  };
  const wrapper = shallow(<FilePicker {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
