import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@kadira/storybook';
import { createModal } from '../src/gui/components/Modal';
import configureStore from '../src/gui/store/index';
import AddServerModal from '../src/gui/components/AddServerModal';

storiesOf('AddServerModal', module)
  .add('default', () => {
    const Modal = createModal({
      AddServerModal
    });
    const store = configureStore();

    return (
      <Provider store={store}>
        <Modal component="AddServerModal" />
      </Provider>
    );
  });
