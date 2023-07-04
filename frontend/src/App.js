import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from './components/LandingPage/index';
import GroupPage from './components/GroupPage/index';

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
        {/* <Route path="/groups/:groupId">
          <GroupPagebyId />
        </Route> */}
        <Route path="/groups">
          <GroupPage />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
