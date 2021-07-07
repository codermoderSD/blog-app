import "./App.css";
import db, { auth } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BlogDetails from "./components/BlogDetails";
import Blogs from "./components/Blogs";
import Login from "./components/Login";
import Register from "./components/Register";
import AddBlog from "./components/AddBlog";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser, setUser } from "./redux/users/userActions";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    //secret function
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //save that data in redux
        db.collection("users")
          .doc(authUser.email)
          .get()
          .then((userData) => dispatch(setUser(userData.data())))
          .catch((err) => {
            alert(err.message);
          });
      } else {
        //call logout user function
        dispatch(logoutUser());
      }
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute component={Blogs} path="/blogs" />
          <PrivateRoute component={BlogDetails} path="/blogDetails" />
          <PrivateRoute component={AddBlog} path="/addBlog" />
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
