import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);

export default app;
