import React from 'react';
import { Route } from 'react-router';
import Main from '../mainView/Main';
import Servers from '../pages/Servers';
import AddServerPage from '../pages/AddServerPage';
import ServerPage from '../pages/ServerPage';

const routes = (
  <Route component={Main}>
    <Route path="/" component={Servers} />
    <Route path="/add-server" component={AddServerPage} />
    <Route path="/server" component={ServerPage} />
  </Route>
);

export default routes;
