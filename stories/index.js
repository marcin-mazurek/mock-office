import React from 'react';
import { storiesOf } from '@kadira/storybook';
import '../src/renderer/styles/main.scss';

import NavBar from '../src/renderer/mainView/NavBar';

storiesOf('NavBar', module)
  .add('default', () => (
    <NavBar />
  ));