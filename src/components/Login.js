import { Avatar } from "@material-ui/core";
import React from "react";
import classes from "../css/Login.module.css";
import { useHistory } from "react-router";
import { useState } from "react";
// import { useSelector } from "react-redux";
import { auth } from "../firebase";
import Loader from "react-loader-spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // const user = useSelector((state) => state.User.user);

  const regsiterPage = () => {
    history.push("/register");
  };

  const loginUser = () => {
    //login logic
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        history.push("/blogs");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className={classes.container}>
      {!loading && (
        <div className={classes.login}>
          <Avatar
            className={classes.avatar}
            src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
            alt="Avatar"
          />
          <div className={classes.input}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-mail"
            />
          </div>
          <div className={classes.input}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={classes.button__container}>
            <button onClick={loginUser}>Login</button>
            <p onClick={regsiterPage}>Click here to register</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="loader">
          <Loader type="BallTriangle" color="#333" height={80} width={80} />
        </div>
      )}
    </div>
  );
};

export default Login;
