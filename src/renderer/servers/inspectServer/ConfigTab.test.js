import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ConfigTab from './ConfigTab';

test('ConfigTab should render', () => {
  const serverDetails = {
    name: 'some name',
    type: 'some type',
    queue: 'queue id',
    id: 'some id',
    port: 3000
  };
  const wrapper = shallow(<ConfigTab serverDetails={serverDetails} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
