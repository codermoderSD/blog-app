import { SET_BLOG_DATA } from "./blogActions";

const initialState = {
  blogData: null,
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BLOG_DATA:
      return {
        blogData: action.payload,
      };
    default:
      return state;
  }
};

export default blogReducer;
