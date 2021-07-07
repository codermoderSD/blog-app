import { Avatar } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "../css/Register.module.css";
import Loader from "react-loader-spinner";
import { auth } from "../firebase";
import db from "../firebase";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loginPage = () => {
    history.push("/");
  };

  const registerUser = () => {
    //create new user

    //firebase basic: collections -> document -> fields
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        //store that user in firestore
        db.collection("users")
          .doc(email)
          .set({
            dbUsername: username,
            dbEmail: email,
          })
          .catch((err) => alert(err.message));

        setLoading(false);
        history.push("/blogs");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className={classes.container}>
      {!loading && (
        <div className={classes.register}>
          <Avatar
            className={classes.avatar}
            src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
            alt="Avatar"
          />
          <div className={classes.input}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
            />
          </div>
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
            <button onClick={registerUser}>Register</button>
            <p onClick={loginPage}>Already have an accout?</p>
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

export default Register;
