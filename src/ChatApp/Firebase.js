import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-tGT0DuQVbuFWApL3AmL6kNgK01ef0r4",
  authDomain: "synchronaut-chatapp.firebaseapp.com",
  projectId: "synchronaut-chatapp",
  storageBucket: "synchronaut-chatapp.appspot.com",
  messagingSenderId: "544929123408",
  appId: "1:544929123408:web:1bc0222b55348fb8345555"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()