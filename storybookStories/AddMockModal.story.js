import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@kadira/storybook';
import { createModal } from '../src/gui/components/Modal';
import configureStore from '../src/gui/store/index';
import AddMockModal from '../src/gui/components/AddMockModal';

storiesOf('AddMockModal', module)
  .add('default', () => {
    const Modal = createModal({
      AddMockModal
    });
    const store = configureStore();

    return (
      <Provider store={store}>
        <Modal component="AddMockModal" />
      </Provider>
    );
  });
