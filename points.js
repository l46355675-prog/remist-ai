const rocket = document.getElementById("rocket")
const angry = document.getElementById("angry")
const free = document.getElementById("free")
const robot = document.getElementById("robot")
const dead = document.getElementById("dead")
const sad = document.getElementById("sad")
export const state = { points: 0 }

const saved = localStorage.getItem("remistPoints")
if (saved) state.points = parseInt(saved)

const unlockedSounds = JSON.parse(localStorage.getItem("unlockedSounds") || "[]")

function updatePointsDisplay() {
  const pointcounter = document.getElementById("pcount")
  if (pointcounter) pointcounter.textContent = state.points
}

function playSoundFromFile(path) {
  const audio = new Audio(path)
  audio.currentTime = 0
  audio.play()
}

export function addPoints(n) {
  state.points += n
  if (state.points >= 1000 && !state.reached1000) {
    state.points += 200
    state.reached1000 = true
  }
  localStorage.setItem("remistPoints", state.points)
  updatePointsDisplay()
}

function unlockPaid(name, cost, soundFile) {
  if (state.points >= cost) {
    playSoundFromFile(soundFile)
    state.points -= cost
    localStorage.setItem("remistPoints", state.points)
    updatePointsDisplay()
    unlockSound(name)
    addPoints(2)
  } else alert("You don't have enough points " + state.points)
}

function unlockSound(name) {
  if (!unlockedSounds.includes(name)) {
    unlockedSounds.push(name)
    localStorage.setItem("unlockedSounds", JSON.stringify(unlockedSounds))
  }
  displayUnlockedSound(name)
}

function displayUnlockedSound(name) {
  const unlockSect = document.querySelector('.unlockednotis')
  if (!unlockSect) return
  if ([...unlockSect.children].some(child => child.textContent === name)) return
  const div = document.createElement('div')
  div.textContent = name
  div.style.display = 'flex'
  div.style.backgroundColor = "var(--button-color)"
  div.style.alignItems = 'center'
  div.style.borderRadius = '10px'
  div.style.width = '80px'
  div.style.padding = '5px'
  div.style.margin = '3px'
  div.style.fontFamily = 'sans-serif'
  div.style.cursor = 'pointer'
  div.addEventListener("click", () => {
    switch(name){
      case "skull": playSoundFromFile("Sounds/Heyy.wav"); break;
      case "rocket": playSoundFromFile("Sounds/no-luck-too-bad-disappointing-sound-effect-112943.mp3"); break;
      case "sentiment_extremely_dissatisfied": playSoundFromFile("Sounds/Do it.mp3"); break;
      case "robot": playSoundFromFile("Sounds/letsgetiton.mp3"); break;
      case "sentiment_very_dissatisfied": playSoundFromFile("Sounds/sound-effects-man-screaming-01-247131.mp3"); break;
      case "sentiment_frustrated": playSoundFromFile("Sounds/torvosaurus-roar-416274.mp3"); break;
    }
  })
  unlockSect.appendChild(div)
}

function dailyLogin() {
  const lastLogin = localStorage.getItem("lastLoginDate")
  const today = new Date().toDateString()
  if (lastLogin !== today) {
    addPoints(1)
    localStorage.setItem("lastLoginDate", today)
  }
}

function beConsistent() {
  const streak = parseInt(localStorage.getItem("consistentStreak") || "0")
  const today = new Date().toDateString()
  const lastCheck = localStorage.getItem("lastCheckDate")
  if (lastCheck !== today) {
    localStorage.setItem("lastCheckDate", today)
    const newStreak = lastCheck === new Date(Date.now() - 86400000).toDateString() ? streak + 1 : 1
    localStorage.setItem("consistentStreak", newStreak)
    addPoints(5)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (!unlockedSounds.includes("skull")) {
    unlockedSounds.push("skull")
    localStorage.setItem("unlockedSounds", JSON.stringify(unlockedSounds))
  }

  dailyLogin()
  beConsistent()
  unlockedSounds.forEach(name => displayUnlockedSound(name))

  free.addEventListener("click", () => {
    displayUnlockedSound("skull")
    addPoints(2)
  })

  rocket.addEventListener("click", () => unlockPaid("rocket", 60, "Sounds/no-luck-too-bad-disappointing-sound-effect-112943.mp3"))
  angry.addEventListener("click", () => unlockPaid("sentiment_extremely_dissatisfied", 150, "Sounds/Do it.mp3"))
  robot.addEventListener("click", () => unlockPaid("robot", 90, "Sounds/letsgetiton.mp3"))
  dead.addEventListener("click", () => unlockPaid("sentiment_very_dissatisfied", 120, "Sounds/sound-effects-man-screaming-01-247131.mp3"))
  sad.addEventListener("click", () => unlockPaid("sentiment_frustrated", 130, "Sounds/torvosaurus-roar-416274.mp3"))
  updatePointsDisplay()
})
