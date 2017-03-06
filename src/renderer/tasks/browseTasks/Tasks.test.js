import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Tasks } from './Tasks';

test('Tasks should render', () => {
  const props = {
    taskIds: new List(),
    queueId: 'some id',
    remove: () => {}
  };
  const wrapper = shallow(<Tasks {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
