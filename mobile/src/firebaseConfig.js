import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-CgdxaTeSPU8eim6QQiJ2oM71XuTRfKc",
  authDomain: "gym-care-6b2d7.firebaseapp.com",
  projectId: "gym-care-6b2d7",
  storageBucket: "gym-care-6b2d7.firebasestorage.app",
  messagingSenderId: "64987967374",
  appId: "1:64987967374:web:6cffc7f3a5871ad87a7edf",
  measurementId: "G-471VF873PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize & Export Firebase services
export const auth = getAuth(app);

// IMPORTANT: If your Firestore database is NOT named "(default)", 
// you must provide its exact name as the second argument below.
// Example: export const db = getFirestore(app, "my-custom-database-id");
export const db = getFirestore(app); 

export const storage = getStorage(app);

export default app;
