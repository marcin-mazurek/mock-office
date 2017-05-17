import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import { Modal } from './Modal';
import configureStore from '../store';

storiesOf('Modal', module)
  .add('addServerModal', () => {
    const store = configureStore();

    return (
      <Provider store={store}>
        <Modal component="addServerModal" close={() => {}} />
      </Provider>
    );
  });
