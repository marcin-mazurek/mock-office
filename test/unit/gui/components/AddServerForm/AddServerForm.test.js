import React from 'react';
import { shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import AddServerForm from '../../../../../src/gui/components/AddServerForm/AddServerForm';

describe('AddServerForm', () => {
  describe('snapshots', () => {
    test('default', () => {
      const props = {
        handleSubmit: () => {}
      };
      const wrapper = shallow(<AddServerForm {...props} />);
      expect(enzymeToJson(wrapper)).toMatchSnapshot();
    });
  });
});
