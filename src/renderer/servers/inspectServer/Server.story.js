import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { ServerPlaceholder } from './Server';

storiesOf('ServerPlaceholder', module)
  .add('server exists', () => (
    <div style={{ height: 500, width: 500 }}>
      <ServerPlaceholder serverExists />
    </div>
  ))
  .add('any server exists', () => (
    <div style={{ height: 500, width: 500 }}>
      <ServerPlaceholder serverExists={false} />
    </div>
  ));
