// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc5gl5D1QBYKP87-DiGh1WuzgLT2b49GE",
  authDomain: "altera-26e46.firebaseapp.com",
  projectId: "altera-26e46",
  storageBucket: "altera-26e46.firebasestorage.app",
  messagingSenderId: "555692896847",
  appId: "1:555692896847:web:26e74481500135fd8bb03a",
  measurementId: "G-HMY5BJD7LV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);