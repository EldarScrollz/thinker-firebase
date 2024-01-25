// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhnNh3QctcjjPy3J83X0cSzrIHvCRrBTg",
  authDomain: "react-firebase-project-7c0ae.firebaseapp.com",
  projectId: "react-firebase-project-7c0ae",
  storageBucket: "react-firebase-project-7c0ae.appspot.com",
  messagingSenderId: "1090981984762",
  appId: "1:1090981984762:web:2b763eaca0bae4d014cc43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
export const dataBase = getFirestore(app);