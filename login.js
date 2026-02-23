import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
export function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log('User logged in: ', user.uid);
            return user
        })
        .then(() => {
            console.log('Succesfully logged in')
            window.location.href = "main.html"
        })
        .catch(error => {
            alert(error.message)
        });
        
}