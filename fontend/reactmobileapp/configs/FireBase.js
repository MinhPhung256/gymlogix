// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm0xZ2LmkDW9p-_BdsIM6fEkFdANsdcmg",
  authDomain: "checkemail-3dd56.firebaseapp.com",
  projectId: "checkemail-3dd56",
  storageBucket: "checkemail-3dd56.firebasestorage.app",
  messagingSenderId: "941708135544",
  appId: "1:941708135544:web:218cb14b2972ba47fa318d",
  measurementId: "G-T0STCR861Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);