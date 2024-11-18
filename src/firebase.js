// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth"; // If using Firebase Authentication
import "firebase/firestore"; // If using Firestore database
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDVUA2FtMGPybk1gFt5GoQ0091k1bPAw-M",
  authDomain: "business-management-app-70a93.firebaseapp.com",
  databaseURL: "https://business-management-app-70a93-default-rtdb.firebaseio.com",
  projectId: "business-management-app-70a93",
  storageBucket: "business-management-app-70a93.firebasestorage.app",
  messagingSenderId: "861187083442",
  appId: "1:861187083442:web:677d064945d50fd4a4cdab",
  measurementId: "G-FKVVD8MVVX"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db };