import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import blogReducer from "./blogs/blogReducer";
import userReducer from "./users/userReducer";

const rootReducer = combineReducers({
  User: userReducer,
  Blog: blogReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
