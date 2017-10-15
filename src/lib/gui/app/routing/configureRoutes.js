import React from 'react';
import { Route, Redirect } from 'react-router';
import { ServerViewConnect } from '../../components/ServerView';
import EditServerPage from '../../components/EditServerPage';
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
      <Route path="/server/:id" component={ServerViewConnect} onEnter={checkIfServerExists} />
      <Route path="/server/:id/edit" component={EditServerPage} onEnter={checkIfServerExists} />
      <Route path="/:id/add-mock" component={AddMockPage} onEnter={checkIfServerExists} />
      <Route path="/" component={LandingPageConnect} />
      <Redirect from="*" to="/" />
    </Route>
  );
}
