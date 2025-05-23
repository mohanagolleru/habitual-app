
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGXb8sNhHTmRmhqYA7B_xp9e5juneFPis",
  authDomain: "habitual-h31p7.firebaseapp.com",
  projectId: "habitual-h31p7",
  storageBucket: "habitual-h31p7.appspot.com", // Corrected from .firebasestorage.app to .appspot.com
  messagingSenderId: "455096463071",
  appId: "1:455096463071:web:6f4735235f196ebc68036a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
