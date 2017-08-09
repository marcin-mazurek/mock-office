import React from 'react';
import { shallow } from 'enzyme';
import Main from '../../../../src/gui/routing/Main';

describe('Main', () => {
  test('should render children', () => {
    const Component = () => <div />;
    const wrapper = shallow(<Main><Component /></Main>);
    expect(wrapper.find(Component)).toHaveLength(1);
  });
});
