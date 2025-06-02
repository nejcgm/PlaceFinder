import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./shared/context/AuthContext";
import { useAuth } from "./shared/hooks/AuthHook";
import LoadingSpinner from "./shared/components/UIElements/ErrorModal/LoadingSpinner";

const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));


const App = () => {
 
  const { token, logIn, logOut, userId } = useAuth();

  let routes;
  if (token) {
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
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          logIn: logIn,
          logOut: logOut,
        }}
      >
        <Router>
          <MainNavigation />
          <div className="mt-[64px]">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>{routes}</Routes>
            </Suspense>
          </div>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
