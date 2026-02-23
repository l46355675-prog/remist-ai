
import { Signup } from './Database/signin.js'; // adjust path if needed

const form = document.querySelector('.formtosign'); // matches your form's class

form.addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPass = document.getElementById('confirmpass').value;

  if (password !== confirmPass) {
    alert("Passwords don't match!");
    return;
  }
const userEmail = localStorage.setItem("userEmail", email)
  Signup(email, password); // call your signup function

  if(!localStorage.getItem("joinDate")) {
    const today = new Date().toLocaleDateString()
    localStorage.setItem("joinDate", today)
  }
});
