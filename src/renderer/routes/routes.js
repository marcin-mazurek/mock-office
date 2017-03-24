import React from 'react';
import { Route } from 'react-router';
import Main from './Main';
import AddServerPage from '../servers/addServer/AddServer';
import ServerPage from '../servers/inspectServer/Server';
import AddDescriptionPage from '../descriptions/addDescription/AddDescription';

const routes = (
  <Route component={Main}>
    <Route path="/add-server" component={AddServerPage} />
    <Route path="/" component={ServerPage} />
    <Route path="/add-description" component={AddDescriptionPage} />
  </Route>
);

export default routes;
