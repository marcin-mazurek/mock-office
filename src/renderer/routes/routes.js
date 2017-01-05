import React from 'react';
import { Route } from 'react-router';
import Main from '../mainView/Main';
import Servers from '../views/Servers';

const routes = (
  <Route path="/" component={Main}>
    <Route path="servers" component={Servers} />
  </Route>
);

export default routes;
