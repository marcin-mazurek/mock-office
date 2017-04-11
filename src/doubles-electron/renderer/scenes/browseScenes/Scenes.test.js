import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Scenes } from './Scenes';

describe('Scenes', () => {
  test('default snapshot', () => {
    const props = {
      sceneIds: new List(),
      queueId: 'some id',
      remove: () => {}
    };
    const wrapper = shallow(<Scenes {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
