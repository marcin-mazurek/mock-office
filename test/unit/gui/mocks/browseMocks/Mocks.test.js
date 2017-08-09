import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Mocks } from '../../../../../src/gui/mocks/browseMocks/Mocks';

describe('Mocks', () => {
  test('default snapshot', () => {
    const props = {
      mocks: new List(),
      server: 'server-id',
      scenario: 'scenario-id',
      remove: () => {}
    };
    const wrapper = shallow(<Mocks {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
