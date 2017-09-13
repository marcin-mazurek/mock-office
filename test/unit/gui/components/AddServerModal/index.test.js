import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import AddServerModal from '../../../../../src/lib/gui/components/AddServerModal';

describe('AddServerModal', () => {
  describe('snapshots', () => {
    test('default', () => {
      const wrapper = shallow(
        <AddServerModal />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
