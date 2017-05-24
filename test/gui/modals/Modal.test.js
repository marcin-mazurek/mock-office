import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ModalConnect, Modal } from '../../../src/gui/modals/Modal';
import configureStore from '../../../src/gui/store/index';
import { openAction, closeAction } from '../../../src/gui/modals/actions';

describe('ModalConnect', () => {
  it('should react properly to store changes', () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <ModalConnect />
      </Provider>
    );

    store.dispatch(openAction('addServerModal'));
    expect(wrapper.find('AddServerModal')).toHaveLength(1);
    store.dispatch(closeAction());
    expect(wrapper.html()).toBeNull();
  });
});

describe('Modal', () => {
  test('no component snapshot', () => {
    const wrapper = shallow(
      <Modal close={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('rendering addServerModal snapshot', () => {
    const wrapper = shallow(
      <Modal component="addServerModal" close={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
