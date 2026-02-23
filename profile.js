const showUserName = document.getElementById("userName")
const user = localStorage.getItem("nameOfUser")
if(user) {
    showUserName.textContent = " " + user
} else {
    showUserName.textContent = " User"
}

const showUserEmail = document.getElementById("user-email");
const email = localStorage.getItem("userEmail");
if(email) {
    showUserEmail.textContent = " " + email
} else {
    showUserEmail.textContent = " No email Found!"
}

const showUserPoints = document.getElementById("user-points");
const points = localStorage.getItem("remistPoints");
if(points) {
    showUserPoints.textContent = " " + points;
} else {
    showUserPoints.textContent = " " + 0;
}

const showUserUsage = document.getElementById("user-count");
const userUsage = localStorage.getItem("userCount");
if(userUsage) {
    showUserUsage.textContent = " " + userUsage
} else {
    showUserUsage.textContent = " " + 0
}

const showUserDate = document.getElementById("join-date");
const joinDate = localStorage.getItem("joinDate");
if(joinDate) {
    showUserDate.textContent = " " + joinDate
} else {
    showUserDate.textContent = " Error not found!"  
}

let streak = parseInt(localStorage.getItem("loginStreak")) || 0;
const lastLogin = localStorage.getItem("lastLogin");
const today = new Date().toDateString();
if (lastLogin !== today) {
    if (lastLogin) {
        const lastDate = new Date(lastLogin);
        const diff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
        if(diff > 1) streak = Math.max(streak - 1, 0);
    }
    streak = Math.min(streak + 1, 7);
    localStorage.setItem("loginStreak", streak);
    localStorage.setItem("lastLogin", today);
}

const maxStreak = 7;
const percent = Math.min((streak / maxStreak) * 100, 100)
document.getElementById('loyaltyfill').style.width = percent + "%"
document.getElementById('loyalty-percent').textContent = Math.round(percent) + ' %'
