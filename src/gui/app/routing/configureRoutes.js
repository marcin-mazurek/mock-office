import React from 'react';
import { Route, Redirect } from 'react-router';
import ServerPage from '../../servers/inspectServer/InspectServer';
import EditServerPage from '../../servers/editServer/EditServerPage';
import AddMockPage from '../../components/AddMock/index';
import LandingPageConnect from '../../components/landingPage/LandingPage';
import App from '../../components/App';

export default function configureRoutes(store) {
  const checkIfServerExists = (nextState, replace) => {
    if (!store.getState().getIn(['entities', 'servers', 'entities', nextState.params.id])) {
      replace('/');
    }
  };

  return (
    <Route component={App}>
      <Route path="/server/:id" component={ServerPage} onEnter={checkIfServerExists} />
      <Route path="/server/:id/edit" component={EditServerPage} onEnter={checkIfServerExists} />
      <Route path="/:id/add-mock" component={AddMockPage} onEnter={checkIfServerExists} />
      <Route path="/" component={LandingPageConnect} />
      <Redirect from="*" to="/" />
    </Route>
  );
}
