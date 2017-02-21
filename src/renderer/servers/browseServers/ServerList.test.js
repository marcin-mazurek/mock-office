import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { ServerList } from './ServerList';

test('ServerList should render', () => {
  const wrapper = shallow(
    <ServerList
      servers={new List()}
      select={() => {}}
      goToServerPage={() => {}}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
