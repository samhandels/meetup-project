import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from './components/LandingPage/index';
import GroupPage from './components/GroupPage';
import GroupIndividual from './components/GroupIndividual'
import EventPage from './components/EventPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/groups/:groupId">
          <GroupIndividual />
        </Route>
        <Route path="/groups">
          <GroupPage />
        </Route>
        <Route path="/events">
          <EventPage />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
