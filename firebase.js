import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbLRB3ZvUhycES_bnOrNrt1WHxvQec8DU",
  authDomain: "remist-c2274.firebaseapp.com",
  projectId: "remist-c2274",
  storageBucket: "remist-c2274.firebasestorage.app",
  messagingSenderId: "300522781851",
  appId: "1:300522781851:web:694f59fd05148208d35a3e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
