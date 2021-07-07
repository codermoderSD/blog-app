import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDRawq4qZu_MGvueLy8R_qFIqfIAXrmov4",
  authDomain: "quad-blogs.firebaseapp.com",
  projectId: "quad-blogs",
  storageBucket: "quad-blogs.appspot.com",
  messagingSenderId: "733514282013",
  appId: "1:733514282013:web:7985159fa304b9dd3a42f4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export default db;
export { auth };
