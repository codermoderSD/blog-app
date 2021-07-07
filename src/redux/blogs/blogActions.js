export const SET_BLOG_DATA = "SET_BLOG_DATA";

export const setBlogData = (blogData) => {
  return {
    type: SET_BLOG_DATA,
    payload: blogData,
  };
};
