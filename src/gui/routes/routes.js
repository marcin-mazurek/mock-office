import React from 'react';
import { Route } from 'react-router';
import Main from './Main';
import AddServerPage from '../servers/addServer/AddServerPage';
import ServerPage from '../servers/inspectServer/Server';
import AddScenePage from '../scenes/addScene/AddScene';

const routes = (
  <Route component={Main}>
    <Route path="/add-server" component={AddServerPage} />
    <Route path="/" component={ServerPage} />
    <Route path="/add-scene" component={AddScenePage} />
  </Route>
);

export default routes;
