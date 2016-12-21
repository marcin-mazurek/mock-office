import React from 'react';
import UnloadedMockList from '../MockList/UnloadedMockList';
import LoadedMockList from '../MockList/LoadedMockList';

const Expectations = () => (
  <div>
    <div>Expectations:</div>
    <UnloadedMockList buttonText="Load" />
    <div>Loaded:</div>
    <LoadedMockList buttonText="Unload" />
  </div>
);

export default Expectations;
