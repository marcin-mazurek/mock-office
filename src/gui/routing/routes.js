import React from 'react';
import { Route, Redirect } from 'react-router';
import Main from './Main';
import AddServerPage from '../servers/addServer/AddServerPage';
import ServerPage from '../servers/inspectServer/Server';
import AddScenePage from '../scenes/addScene/AddScene';
import LandingPageConnect from '../landingPage/LandingPage';

export default function configureRoutes(store) {
  const checkIfServerExists = (nextState, replace) => {
    if (!store.getState().getIn(['servers', 'ids']).includes(nextState.params.id)) {
      replace('/');
    }
  };

  return (
    <Route component={Main}>
      <Route path="/add-server" component={AddServerPage} />
      <Route path="/server/:id" component={ServerPage} onEnter={checkIfServerExists} />
      <Route path="/:id/add-scene" component={AddScenePage} onEnter={checkIfServerExists} />
      <Route path="/" component={LandingPageConnect} />
      <Redirect from="*" to="/" />
    </Route>
  );
}
