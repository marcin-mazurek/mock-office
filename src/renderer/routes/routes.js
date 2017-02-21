import React from 'react';
import { Route } from 'react-router';
import Main from '../layout/main';
import Servers from '../servers/views/Servers';
import AddServerPage from '../servers/views/AddServer';
import ServerPage from '../servers/views/Server';
import AddTaskPage from '../tasks/addTask/AddTask';

const routes = (
  <Route component={Main}>
    <Route path="/" component={Servers} />
    <Route path="/add-server" component={AddServerPage} />
    <Route path="/server" component={ServerPage} />
    <Route path="/add-task" component={AddTaskPage} />
  </Route>
);

export default routes;
