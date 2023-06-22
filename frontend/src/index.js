import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwEWZk68el76pkUHIc07U0AjU5IjofS8s",
  authDomain: "byte-plus-bit.firebaseapp.com",
  databaseURL: "https://byte-plus-bit-default-rtdb.firebaseio.com",
  projectId: "byte-plus-bit",
  storageBucket: "byte-plus-bit.appspot.com",
  messagingSenderId: "185713731222",
  appId: "1:185713731222:web:d6d6bd7a559b9fd70ac4b7",
  measurementId: "G-PLFPHPNW59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
