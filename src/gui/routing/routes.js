import React from 'react';
import { Route, Redirect } from 'react-router';
import Main from './Main';
import ServerPage from '../servers/inspectServer/InspectServer';
import EditServerPage from '../servers/editServer/EditServerPage';
import AddMockPage from '../mocks/addMock/AddMock';
import LandingPageConnect from '../landingPage/LandingPage';

export default function configureRoutes(store) {
  const checkIfServerExists = (nextState, replace) => {
    if (!store.getState().getIn(['entities', 'servers', 'entities', nextState.params.id])) {
      replace('/');
    }
  };

  return (
    <Route component={Main}>
      <Route path="/server/:id" component={ServerPage} onEnter={checkIfServerExists} />
      <Route path="/server/:id/edit" component={EditServerPage} onEnter={checkIfServerExists} />
      <Route path="/:id/add-mock" component={AddMockPage} onEnter={checkIfServerExists} />
      <Route path="/" component={LandingPageConnect} />
      <Redirect from="*" to="/" />
    </Route>
  );
}
