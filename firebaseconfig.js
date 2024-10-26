import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBH4AchcBDNa1NqLAofsaeXBfITeSetQn0",
  authDomain: "community-scape.firebaseapp.com",
  projectId: "community-scape",
  storageBucket: "community-scape.appspot.com",
  messagingSenderId: "1089428313834",
  appId: "1:1089428313834:web:d0ab4f94624368a018a993",
  measurementId: "G-6F20DFKMFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

export { app, db, auth}; // Ensure auth is exported
