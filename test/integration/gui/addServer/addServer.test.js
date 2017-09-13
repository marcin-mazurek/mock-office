import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import SidebarServers from '../../../../src/lib/gui/components/SidebarServers';
import AddServerModal from '../../../../src/lib/gui/components/AddServerModal';
import { AddServerFormConnect } from '../../../../src/lib/gui/components/AddServerForm';
import { ModalConnect } from '../../../../src/lib/gui/components/Modal';

describe('Add server', () => {
  jest.mock('../../../../src/lib/gui/resources/api', () => ({
    addServer() {
      return Promise.resolve({
        data: {
          id: 'server-id',
          port: 3000,
          name: 'name',
          type: 'http',
          secure: false
        }
      });
    }
  }));

  test('Given that user clicks on add server icon user should see form', () => {
    const configureStore = require('../../../../src/lib/gui/app/configureStore').default;
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <div>
          <SidebarServers />
          <ModalConnect />
        </div>
      </Provider>
    );
    const submitButton = wrapper.find('.sidebar-servers__add-server-button');
    submitButton.simulate('click');
    expect(wrapper.find(AddServerModal).exists()).toBeTruthy();
  });

  test('Given that user clicks add server form submit button' +
    ', after successful response from server' +
    'user should see new server on server list', (done) => {
    const configureStore = require('../../../../src/lib/gui/app/configureStore').default;
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <div>
          <SidebarServers />
          <AddServerFormConnect />
        </div>
      </Provider>
    );
    const addServerFormWrapper = wrapper.find('.add-server-form');
    const serverCount = wrapper.find('.sidebar-servers-list-item').length;
    addServerFormWrapper.simulate('submit');
    setTimeout(() => {
      expect(wrapper.find('.sidebar-servers-list-item')).toHaveLength(serverCount + 1);
      done();
    }, 100);
  });
});
