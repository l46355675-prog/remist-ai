import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

export function Signup(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("User made: ", user)
      return sendEmailVerification(user);
    })
    .then(() => {
      console.log('Verification email sent!');
      window.location.href = "confirmation.html";
    })
    .catch(error => {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    });
}