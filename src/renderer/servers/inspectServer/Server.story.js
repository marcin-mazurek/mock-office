import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { ServerNotSelected } from './Server';

storiesOf('ServerNotSelected', module)
  .add('default', () => (
    <div style={{ height: 500, width:500 }}>
      <ServerNotSelected />
    </div>
  ));
