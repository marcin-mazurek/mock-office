import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FilePicker } from './FilePicker';

describe('FilePicker', () => {
  test('should render', () => {
    const props = {
      initAddQueueFromFile: () => {}
    };

    const wrapper = shallow(<FilePicker {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should dispatch action if file has been selected', () => {
    const mockedHandleChange = jest.fn();

    const props = {
      initAddQueueFromFile: mockedHandleChange
    };

    const wrapper = mount(<FilePicker {...props} />);
    const fileInput = wrapper.find('input');

    fileInput.simulate('change', {
      target: {
        files: []
      }
    });

    expect(mockedHandleChange.mock.calls.length).toEqual(0);

    fileInput.simulate('change', {
      target: {
        files: [
          'some-file'
        ]
      }
    });

    expect(mockedHandleChange.mock.calls.length).toEqual(1);
  });

  test('should clean input value after file pick', () => {
    const props = {
      initAddQueueFromFile: () => {}
    };
    const wrapper = mount(<FilePicker {...props} />);
    const fileInput = wrapper.find('input');

    fileInput.simulate('change', {
      target: {
        files: [
          {
            name: 'some-file'
          }
        ],
        value: 'filename.ext'
      }
    });

    expect(fileInput.getDOMNode().value).toEqual('');
  });
});
