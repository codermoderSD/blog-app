import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "../css/AddBlog.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { useRef } from "react";
import db from "../firebase";
import { useSelector } from "react-redux";
import firebase from "firebase";
import Loader from "react-loader-spinner";

const AddBlog = () => {
  const [loading, setLoading] = useState(false);
  const [firebaseBlogs, setFirebaseBlogs] = useState([]);
  const fetchBlog = () => {
    db.collection("blogs")
      .orderBy("timestamp", "desc")
      .get()
      .then((blogData) => setFirebaseBlogs(blogData.docs.map((blog) => blog)))
      .catch((err) => alert(err.message));
    console.log(firebaseBlogs);
  };
  const titleRef = useRef();
  const contentRef = useRef();
  const history = useHistory();
  const user = useSelector((state) => state.User.user);
  const addBlog = () => {
    setLoading(true);
    if (
      titleRef.current.value.length > 5 &&
      contentRef.current.value.length > 5
    ) {
      //store in database
      db.collection("blogs")
        .add({
          blogTitle: titleRef.current.value,
          blogContent: contentRef.current.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: user.dbUsername,
          email: user.dbEmail,
        })
        .then(() => {
          setLoading(false);
          titleRef.current.value = "";
          contentRef.current.value = "";
          history.push("/blogs");
        })
        .catch((err) => {
          setLoading(false);
          alert(err.message);
        });

      fetchBlog();
    } else {
      setLoading(false);
      alert("The Title or the Content is Insufficient");
    }
  };
  return (
    <div className={classes.add__blog}>
      {!loading && (
        <>
          <CloseIcon
            onClick={() => history.push("/blogs")}
            fontSize="large"
            className={classes.close__icon}
          />
          <h1>Add a New Blog</h1>
          <div className={classes.blog__form}>
            <input ref={titleRef} type="text" placeholder="Blog Title" />
            <textarea
              ref={contentRef}
              type="text"
              placeholder="Enter Your Content here..."
              rows="12"
            />
          </div>
          <div className={classes.add__button}>
            <button onClick={addBlog}>Add</button>
          </div>
        </>
      )}
      {loading && (
        <div className={classes.loader}>
          <Loader type="BallTriangle" color="#333" height={80} width={80} />
        </div>
      )}
    </div>
  );
};

export default AddBlog;
