import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "../css/BlogDetails.module.css";
import db from "../firebase";
import firebase from "firebase";
import Delete from "@material-ui/icons/Delete";

const BlogDetails = () => {
  const [comments, setComments] = useState([]);

  const history = useHistory();
  if (!useSelector((state) => state.Blog)) {
    history.push("/blogs");
  }

  const blogData = useSelector((state) => state.Blog.blogData.blogData);

  const blogId = useSelector((state) => state.Blog.blogData.blogId);

  const user = useSelector((state) => state.User.user);

  const timesAgo = moment(blogData.timestamp?.toDate()).fromNow();

  const commentRef = useRef();

  useEffect(() => {
    const unsubscribe = db
      .collection("blogs")
      .doc(blogId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => setComments(snap.docs.map((comment) => comment)));
    return () => {
      unsubscribe();
    };
  });

  const saveCommentToFirebase = (e) => {
    if (e.key === "Enter") {
      db.collection("blogs")
        .doc(blogId)
        .collection("comments")
        .add({
          comment: commentRef.current.value,
          user: user,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then()
        .catch((err) => err.message);
      commentRef.current.value = "";
    }
  };

  return (
    <div className={classes.blogDetails}>
      <h1 className={classes.title}>{blogData.blogTitle}</h1>
      <div className={classes.content}>
        <p>{blogData.blogContent}</p>
        <div className={classes.author}>
          <h2>
            Author: <span>{blogData.name}</span>
          </h2>
          <h3>{timesAgo}</h3>
        </div>
      </div>
      <div className={classes.comments}>
        <hr />
        <h2>Comments</h2>
        <hr />
        <input
          onKeyDown={saveCommentToFirebase}
          ref={commentRef}
          type="text"
          placeholder="Enter Your Comments"
        />
        {comments?.map((comment) => {
          const isThisMyComment = user.dbEmail === comment.data().user.dbEmail;
          const deleteComment = () => {
            db.collection("blogs")
              .doc(blogId)
              .collection("comments")
              .doc(comment.id)
              .delete()
              .catch((err) => alert(err.message));
          };
          return (
            <div key={comment.id} className={classes.comment__container}>
              {isThisMyComment && (
                <Delete
                  onClick={deleteComment}
                  className={classes.delete__btn}
                />
              )}
              <p>{comment.data().user.dbUsername}</p>
              <h1>{comment.data().comment}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogDetails;
