// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-a951e.firebaseapp.com",
  projectId: "real-estate-a951e",
  storageBucket: "real-estate-a951e.appspot.com",
  messagingSenderId: "817351879108",
  appId: "1:817351879108:web:32acd69c694f024937dc91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);