import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Tasks } from './Tasks';

describe('Tasks', () => {
  test('default snapshot', () => {
    const props = {
      taskIds: new List(),
      queueId: 'some id',
      remove: () => {}
    };
    const wrapper = shallow(<Tasks {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
