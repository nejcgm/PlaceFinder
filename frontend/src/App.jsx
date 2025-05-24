import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./shared/context/AuthContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logIn = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </>
    );
  }

  return (
    <>
      <AuthContext.Provider
        value={{ isLoggedIn: isLoggedIn, logIn: logIn, logOut: logOut }}
      >
        <Router>
          <MainNavigation />
          <div className="mt-[64px]">
            <Routes>
              {routes}
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
