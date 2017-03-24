import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Descriptions } from './Descriptions';

describe('Descriptions', () => {
  test('default snapshot', () => {
    const props = {
      descriptionIds: new List(),
      queueId: 'some id',
      remove: () => {}
    };
    const wrapper = shallow(<Descriptions {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
