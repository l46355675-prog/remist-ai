import {login} from './Database/login.js'

const form = document.querySelector('.formtologin')

form.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.getElementById('email').value.trim()
    const pass = document.getElementById('pass').value

    const user = email.split("@")[0]
    localStorage.setItem("nameOfUser", user)
    let count = localStorage.getItem("userCount")
    count = count ? parseInt(count) + 1 : 0;
    localStorage.setItem("userCount", count)
    login(email, pass)
    const today = new Date().toISOString().split('T')[0]
    const lastLogin = localStorage.getItem("lastLoginDate")
    let streak = parseInt(localStorage.getItem("loginStreak")) || 0
    if(lastLogin !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yestStreak = yesterday.toISOString().split['T'][0]
        streak = (lastLogin === yestStreak) ? streak + 1 : 1
        localStorage.setItem('lastLoginDate', today)
        localStorage.setItem('loginStreak', streak) 
    }
})

