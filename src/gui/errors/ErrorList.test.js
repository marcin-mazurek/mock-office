import React from 'react';
import { shallow, mount } from 'enzyme';
import { List } from 'immutable';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from '../store';
import { add } from '../entities/errors/actions';

jest.mock('node-unique', () => () => 'id');

const ErrorList = require('./ErrorList').ErrorList;
const AppError = require('../entities/errors/AppError').default;
const ErrorListConnect = require('./ErrorList').default;

describe('ErrorList', () => {
  it('should display reason', () => {
    const errors = List.of(new AppError('reason 1'));
    const wrapper = shallow(
      <ErrorList errors={errors} remove={() => {}} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should display remove button', () => {
    const err = new AppError('reason 1');
    const errors = List.of(err);
    const wrapper = shallow(
      <ErrorList errors={errors} remove={() => {}} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('ErrorListConnect', () => {
  it('should display current errors from redux store', () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <ErrorListConnect />
      </Provider>
    );
    const errorList = wrapper.find(ErrorList);
    expect(toJson(errorList)).toMatchSnapshot();
    store.dispatch(add(['reason 1']));
    expect(toJson(errorList)).toMatchSnapshot();
    errorList.find('li').first().find('button').simulate('click');
    expect(toJson(errorList)).toMatchSnapshot();
  });
});
