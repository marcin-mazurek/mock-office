import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List } from 'immutable';
import { Servers } from './Servers';

test('Servers should render', () => {
  const wrapper = shallow(
    <Servers
      servers={new List()}
      select={() => {}}
      goToServerPage={() => {}}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
