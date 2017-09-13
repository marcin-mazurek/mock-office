import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import EditServerPage from '../../../../../src/lib/gui/components/EditServerPage';

describe('EditServerPage', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<EditServerPage params={{ id: 'id' }} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
