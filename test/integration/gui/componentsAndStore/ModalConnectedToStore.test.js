import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { OVERLAY_CLICKED } from '../../../../src/lib/gui/components/Modal/actions';
import AddServerModal from '../../../../src/lib/gui/components/AddServerModal';
import { ModalConnect } from '../../../../src/lib/gui/components/Modal';
import configureStore from '../../../../src/lib/gui/app/configureStore';
import { ADD_BUTTON_CLICKED, addButtonClickedAction } from '../../../../src/lib/gui/components/SidebarServers/SideBarServers';

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
    store.dispatch(addButtonClickedAction());
    wrapper.find('.modal__overlay').simulate('click');
    expect(wrapper.find('.modal').exists()).toBeFalsy();
  });
});
