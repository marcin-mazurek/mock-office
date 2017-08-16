import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import EditableField from '../../../../../src/gui/components/EditableField';

describe('EditableField', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<EditableField value="Some value" onSave={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('edited snapshot', () => {
    const wrapper = shallow(<EditableField edit value="Some value" onSave={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
