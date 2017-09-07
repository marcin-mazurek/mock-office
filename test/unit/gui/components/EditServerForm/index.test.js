import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import {
  EditServerFormConnect,
  EditServerForm
} from '../../../../../src/gui/components/EditServerForm';
import configureStore from '../../../../../src/gui/app/configureStore';
import { succeededAction } from '../../../../../src/gui/epics/addServer/actions';

describe('EditServerForm', () => {
  test('default snapshot', () => {
    const wrapper = shallow(
      <EditServerForm
        handleSubmit={() => {
        }}
        serverId={'id'}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('EditServerFormConnect', () => {
  it('should be connected to store', () => {
    const store = configureStore();
    store.dispatch(succeededAction({
      data: {
        name: 'Awesome server',
        port: 3000,
        type: 'http',
        secure: false,
        scenario: 'cj45fwix00001yrve66ecdxp0',
        running: false,
        id: 'server-id'
      }
    }));
    const wrapper = mount(
      <Provider store={store}>
        <EditServerFormConnect serverId="server-id" />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
