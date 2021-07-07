import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.User.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <Route
      {...rest}
      render={(props) => {
        return loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <Loader type="BallTriangle" color="#333" height={80} width={80} />
          </div>
        ) : user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
