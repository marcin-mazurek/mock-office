import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import R from 'ramda';
import { createModal } from '../../../../../src/gui/components/Modal';

describe('Modal', () => {
  test('no component snapshot', () => {
    const Modal = createModal({});
    const wrapper = shallow(
      <Modal onOverlayClick={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('rendering addServerModal snapshot', () => {
    const TestModal = () => <div />;
    const Modal = createModal({ TestModal });
    const wrapper = shallow(
      <Modal component="TestModal" onOverlayClick={R.identity} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
