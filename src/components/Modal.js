import React from "react";
import { useState } from "react";
import classes from "../css/Modal.module.css";
import Loader from "react-loader-spinner";
import db from "../firebase";

const Modal = ({ setShowModal, blogDataModal, setFirebaseBlogs }) => {
  const [editTitle, setEditTitle] = useState(blogDataModal.data().blogTitle);
  const [editContent, setEditContent] = useState(
    blogDataModal.data().blogContent
  );
  const [loading, setLoading] = useState(false);

  const updateValue = () => {
    setLoading(true);
    db.collection("blogs")
      .doc(blogDataModal.id)
      .update({
        blogTitle: editTitle,
        blogContent: editContent,
      })
      .then(() => {
        setLoading(false);
        setShowModal(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };

  return (
    <div className={classes.modal}>
      {!loading && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className={classes.outer__container}
          ></div>

          <div className={classes.inner__container}>
            <div className={classes.inner__input}>
              <input
                autoFocus
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                rows={12}
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            <div className={classes.btn__grp}>
              <button onClick={() => setShowModal(false)}>Cancle</button>
              <button onClick={updateValue}>Submit</button>
            </div>
          </div>
        </>
      )}
      {loading && (
        <div className={classes.loader}>
          <Loader type="TailSpin" color="#97ffad" height={80} width={80} />
        </div>
      )}
    </div>
  );
};

export default Modal;
