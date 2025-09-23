// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-2rBTZjxED7fO2Rj2PPnfwEDkgfwwGHY",
  authDomain: "gymlogix-4443a.firebaseapp.com",
  projectId: "gymlogix-4443a",
  storageBucket: "gymlogix-4443a.firebasestorage.app",
  messagingSenderId: "617132790885",
  appId: "1:617132790885:web:d068404636a94eb938628c",
  measurementId: "G-RG5Y47EEM7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);