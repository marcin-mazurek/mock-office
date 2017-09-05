import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from '../../../../src/gui/app/configureStore';
import {
  AddServerFormConnect,
  AddServerForm
} from '../../../../src/gui/components/AddServerForm';

describe('AddServerFormConnect', () => {
  test('should let AddServerForm display redux-form controls', () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <AddServerFormConnect />
      </Provider>
    );

    expect(wrapper.find(AddServerForm).exists()).toBeTruthy();
  });
});
