// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC10dFkdc5i1pU2lxVikzrwR4ejND0vdVk",
  authDomain: "health-and-wellness-app-74b4f.firebaseapp.com",
  projectId: "health-and-wellness-app-74b4f",
  storageBucket: "health-and-wellness-app-74b4f.appspot.com",
  messagingSenderId: "436128409613",
  appId: "1:436128409613:web:36fe7e3c52545d5eb7cd44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);