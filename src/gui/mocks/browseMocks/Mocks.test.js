import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Mocks } from './Mocks';

describe('Mocks', () => {
  test('default snapshot', () => {
    const props = {
      mockIds: new List(),
      scenarioId: 'some id',
      remove: () => {}
    };
    const wrapper = shallow(<Mocks {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});