import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Server, ServerNotSelected, ServerInspect } from './Server';
import StartButtonConnect from '../startServer/StartButton';
import StopButtonConnect from '../stopServer/StopButton';

test('ServerNotSelected should render', () => {
  const wrapper = shallow(<ServerNotSelected />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('Server should render', () => {
  const props = {
    selected: 'id',
    running: true,
    serverDetails: {
      name: 'some id',
      type: 'some type',
      port: 3000,
      queue: 'some queue id',
      id: 'some id'
    }
  };
  const wrapper = shallow(<Server {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('ServerInspect should render', () => {
  const props = {
    running: true,
    serverDetails: {
      name: 'some id',
      type: 'some type',
      port: 3000,
      queue: 'some queue id',
      id: 'some id'
    }
  };
  const wrapper = shallow(<ServerInspect {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('ServerInspect should display stop button', () => {
  const props = {
    running: false,
    serverDetails: {
      name: 'some id',
      type: 'some type',
      port: 3000,
      queue: 'some queue id',
      id: 'some id'
    }
  };
  const wrapper = shallow(<ServerInspect {...props} />);
  expect(wrapper.find(StopButtonConnect)).toBeTruthy();
});

test('ServerInspect should display stop button', () => {
  const props = {
    running: true,
    serverDetails: {
      name: 'some id',
      type: 'some type',
      port: 3000,
      queue: 'some queue id',
      id: 'some id'
    }
  };
  const wrapper = shallow(<ServerInspect {...props} />);
  expect(wrapper.find(StartButtonConnect)).toBeTruthy();
});
