import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { NavBarServers } from './NavBarServers';

test('NavBarServers should render', () => {
  const wrapper = shallow(
    <NavBarServers
      servers={new List()}
      select={() => {}}
      goToServerPage={() => {}}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
