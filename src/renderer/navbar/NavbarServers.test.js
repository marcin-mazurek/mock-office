import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { NavbarServers } from './NavbarServers';

test('NavbarServers should render', () => {
  const wrapper = shallow(
    <NavbarServers
      servers={new List()}
      select={() => {}}
      goToServerPage={() => {}}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
