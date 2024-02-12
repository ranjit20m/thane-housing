// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "thane-housing.firebaseapp.com",
  projectId: "thane-housing",
  storageBucket: "thane-housing.appspot.com",
  messagingSenderId: "644869601254",
  appId: "1:644869601254:web:24edea50fdcd470dcb4827"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);