const showUserName = document.getElementById("username")
const user = localStorage.getItem("nameOfUser")

if(user) {
    showUserName.placeholder = user
} else {
    showUserName.placeholder = " UserName   "
}

const showUserEmail = document.getElementById("user-email")
const userEmail = localStorage.getItem("userEmail")

if(userEmail) {
    showUserEmail.placeholder = userEmail
} else {
    showUserEmail.placeholder = " UserEmail   "
}

