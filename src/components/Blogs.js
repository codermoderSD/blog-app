import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "../css/Blogs.module.css";
import db, { auth } from "../firebase";
import { logoutUser } from "../redux/users/userActions";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import Modal from "./Modal";
import { setBlogData } from "../redux/blogs/blogActions";

const BlogCard = ({ blog, deleteHandler, setShowModal, setBlogDataModal }) => {
  const user = useSelector((state) => state.User.user);
  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const timesAgo = moment(blog.data().timestamp?.toDate()).fromNow();

  const history = useHistory();

  const showButton = user.dbEmail === blog.data().email;

  const dispatch = useDispatch();

  const takeMeToDetails = () => {
    dispatch(
      setBlogData({
        blogId: blog.id,
        blogData: blog.data(),
      })
    );
    history.push("/blogDetails");
  };

  return (
    <div className={classes.blog__card}>
      <div className={classes.card__header}>
        <div className={classes.head__left}>
          <h1 className={classes.title}>{blog.data().blogTitle}</h1>
          <h2 className={classes.author}>{blog.data().name}</h2>
        </div>
        {showButton && (
          <div className={classes.head__right}>
            <EditIcon
              onClick={() => {
                setBlogDataModal(blog);
                setShowModal(true);
              }}
              className={classes.edit__btn}
            />
            <DeleteIcon
              onClick={() => deleteHandler(blog.id)}
              className={classes.delete__btn}
            />
          </div>
        )}
      </div>
      <div className={classes.card__details}>
        <p className={classes.card__content}>
          {truncate(blog.data().blogContent, 130)}
          <span onClick={takeMeToDetails}> ...Read more</span>
        </p>
        <p className={classes.card__time}>{timesAgo}</p>
      </div>
    </div>
  );
};

const Blogs = () => {
  const [firebaseBlogs, setFirebaseBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blogDataModal, setBlogDataModal] = useState();

  useEffect(() => {
    const unsubscribe = db
      .collection("blogs")
      .orderBy("timestamp", "desc")
      .onSnapshot((blogData) =>
        setFirebaseBlogs(blogData.docs.map((blog) => blog))
      );
    return () => {
      unsubscribe();
    };
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  const deleteHandler = (id) => {
    //delete logic
    setLoading(true);
    db.collection("blogs")
      .doc(id)
      .delete()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };

  return (
    <div className={classes.blogs}>
      {showModal && (
        <Modal
          setFirebaseBlogs={setFirebaseBlogs}
          blogDataModal={blogDataModal}
          setShowModal={setShowModal}
        />
      )}
      <div className={classes.logout__button}>
        <button
          className={classes.add__blog}
          onClick={() => history.push("/addBlog")}
        >
          Add a Blog
        </button>
        <button
          className={classes.logout}
          onClick={() => {
            auth.signOut();
            dispatch(logoutUser());
          }}
        >
          Logout
        </button>
      </div>
      {!loading && (
        <div className={classes.blogs__container}>
          {firebaseBlogs?.map((blog) => {
            return (
              <BlogCard
                setBlogDataModal={setBlogDataModal}
                setShowModal={setShowModal}
                deleteHandler={deleteHandler}
                key={blog.id}
                blog={blog}
              />
            );
          })}
        </div>
      )}
      {loading && (
        <div className={classes.loader}>
          <Loader type="TailSpin" color="#fff" height={80} width={80} />
        </div>
      )}
    </div>
  );
};

export default Blogs;
