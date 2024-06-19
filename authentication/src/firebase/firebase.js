// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzaTOO_OkEFmzfY7o3epTBEf3vV18dIUg",
  authDomain: "israeli-hokcey-league.firebaseapp.com",
  projectId: "israeli-hokcey-league",
  storageBucket: "israeli-hokcey-league.appspot.com",
  messagingSenderId: "972981668450",
  appId: "1:972981668450:web:a180ca64711faf22c05f3b",
  measurementId: "G-YWW0ER804P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };