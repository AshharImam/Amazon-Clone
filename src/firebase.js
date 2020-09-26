import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-AZ8G7PEbeaJEUODEaHCWBkBkELNsxHU",
  authDomain: "clone-abac6.firebaseapp.com",
  databaseURL: "https://clone-abac6.firebaseio.com",
  projectId: "clone-abac6",
  storageBucket: "clone-abac6.appspot.com",
  messagingSenderId: "428412783065",
  appId: "1:428412783065:web:ebe3ed14b02b497d5fb1c8",
  measurementId: "G-J8YDHHRTFJ",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };

export default "";
