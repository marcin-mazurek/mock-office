import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Modal, OVERLAY_CLICKED } from '../../../src/gui/modals/Modal/Modal';
import { components } from '../../../src/gui/modals';
import configureStore from '../../../src/gui/store/index';
import { ADD_BUTTON_CLICKED, addButtonClickedAction } from '../../../src/gui/sidebar/SideBarServers';
import AddServerModal from '../../../src/gui/modals/AddServerModal';

const ModalConnect = components.ModalConnect;

describe('ModalConnect', () => {
  it(`should display AddServerModal on ${ADD_BUTTON_CLICKED} action`, () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <ModalConnect />
      </Provider>
    );

    store.dispatch(addButtonClickedAction());
    expect(wrapper.find(AddServerModal)).toHaveLength(1);
  });

  it(`should close modal on ${OVERLAY_CLICKED} action`, () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <ModalConnect />
      </Provider>
    );
    const modalWrapper = wrapper.find(Modal);
    store.dispatch(addButtonClickedAction());
    modalWrapper.find('.modal__overlay').simulate('click');
    expect(modalWrapper.html()).toBeNull();
  });
});

describe('Modal', () => {
  test('no component snapshot', () => {
    const wrapper = shallow(
      <Modal onOverlayClick={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('rendering addServerModal snapshot', () => {
    const wrapper = shallow(
      <Modal component="addServerModal" onOverlayClick={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
