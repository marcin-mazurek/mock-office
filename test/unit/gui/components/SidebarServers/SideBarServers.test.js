import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { SideBarServers } from '../../../../../src/lib/gui/components/SidebarServers/SideBarServers';

test('SideBarServers should render', () => {
  const wrapper = shallow(
    <SideBarServers
      servers={new List()}
      select={() => {}}
      goToServerPage={() => {}}
      onExportButtonClick={() => {}}
      onAddButtonClick={() => {}}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
