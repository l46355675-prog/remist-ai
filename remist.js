import { state, addPoints } from './points.js';
import { db, auth } from './Database/firebase.js';
import { collection, addDoc, getDocs, query, where, doc as docRef, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

let user = null;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const send = document.getElementById("send");
  const reminders = document.getElementById("remists");
  const note = document.getElementById("notes");
  const savedNote = localStorage.getItem("notes");
  if (savedNote) note.value = savedNote;
  note.addEventListener("input", () => { localStorage.setItem("notes", note.value.trim()); });
  if (!container || !send || !reminders) return;
  send.addEventListener("click", async () => {
    const reminderText = reminders.value.trim();
    if (!reminderText) return;
    const userMood = localStorage.getItem("userMood") || "fine";
    let difficulty = userMood === "tired" ? "easy" : userMood === "productive" ? "hard" : Math.random() < 0.5 ? "easy" : "hard";
    try {
      const reminderDoc = await addDoc(collection(db, "reminders"), { text: reminderText, userId: user.uid, mood: userMood, difficulty: difficulty, date: new Date().toISOString(), done: false });
      await addDoc(collection(db, "remindersHistory"), { text: reminderText, userId: user.uid, mood: userMood, difficulty: difficulty, date: new Date().toISOString(), done: false });
      reminders.value = "";
      localStorage.setItem("reminder", "");
      await loadReminders(container);
    } catch (error) { console.error(error); }
  });
  onAuthStateChanged(auth, (usr) => { user = usr; if (usr) loadReminders(container); else container.textContent = "Please log in to see reminders."; });
});

function createDifficultyDropdown(selectedDifficulty = null, text = "") {
  const diffSelect = document.createElement("select");
  diffSelect.style.backgroundColor = "var(--button-color)";
  diffSelect.style.border = "2px solid black";
  diffSelect.style.borderRadius = "5px";
  diffSelect.style.padding = "2px";
  diffSelect.style.fontFamily = "sans-serif";
  diffSelect.style.fontWeight = "bold";
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Difficulty";
  defaultOption.disabled = true;
  defaultOption.selected = !selectedDifficulty;
  diffSelect.appendChild(defaultOption);
  const easyOption = document.createElement("option");
  easyOption.value = "easy";
  easyOption.textContent = "Easy";
  easyOption.style.color = "var(--button-color)";
  if (selectedDifficulty === "easy") easyOption.selected = true;
  diffSelect.appendChild(easyOption);
  const hardOption = document.createElement("option");
  hardOption.value = "hard";
  hardOption.textContent = "Hard";
  hardOption.style.color = "var(--button-color)";
  if (selectedDifficulty === "hard") hardOption.selected = true;
  diffSelect.appendChild(hardOption);
  diffSelect.dataset.docId = "";
  diffSelect.dataset.text = text;
  diffSelect.addEventListener("change", async () => {
    try {
      await updateDoc(docRef(db, "reminders", diffSelect.dataset.docId), { difficulty: diffSelect.value });
      const historySnapshot = await getDocs(query(collection(db, "remindersHistory"), where("userId", "==", user.uid), where("text", "==", diffSelect.dataset.text)));
      historySnapshot.forEach(async (doc) => { await updateDoc(docRef(db, "remindersHistory", doc.id), { difficulty: diffSelect.value }); });
    } catch (error) { console.error(error); }
  });
  return diffSelect;
}

function createDeleteButton(remist, doc) {
  const deletebutton = document.createElement("button");
  deletebutton.textContent = "Delete";
  deletebutton.style.borderRadius = "5px";
  deletebutton.style.backgroundColor = "var(--button-color)";
  deletebutton.style.border = "2px solid black";
  deletebutton.style.fontFamily = "sans-serif";
  deletebutton.style.fontWeight = "bolder";
  deletebutton.style.cursor = 'pointer'
  deletebutton.addEventListener("click", async () => {
    addPoints(1);
    if (remist.intervalId) clearInterval(remist.intervalId);
    if (remist.audioObj) { remist.audioObj.pause(); remist.audioObj.currentTime = 0; }
    try { await deleteDoc(docRef(db, "reminders", doc.id)); remist.remove(); } catch (error) { console.error(error); }
  });
  return deletebutton;
}

function createAudioDropdown(data, reminderId) {
  const dropdown = document.createElement("select");
  dropdown.style.margin = "5px";
  dropdown.style.backgroundColor = "var(--button-color)";
  dropdown.style.border = "2px solid black";
  dropdown.style.borderRadius = "5px";
  const unlockedSounds = JSON.parse(localStorage.getItem("unlockedSounds") || "[]");
  data.forEach((item, i) => {
    if (i === 0) {
      const option = document.createElement("option");
      option.textContent = "Select sound";
      option.selected = true;
      option.disabled = true;
      option.style.backgroundColor = "var(--button-color)";
      dropdown.appendChild(option);
    } else {
      if (item.category === "paid" && !unlockedSounds.includes(item.name)) return;
      const option = document.createElement("option");
      option.textContent = item.name;
      option.value = item.file;
      option.style.backgroundColor = "var(--button-color)";
      dropdown.appendChild(option);
    }
  });
  const savedSound = localStorage.getItem("reminderSound_" + reminderId);
  if (savedSound) dropdown.value = savedSound;
  dropdown.addEventListener("change", () => { localStorage.setItem("reminderSound_" + reminderId, dropdown.value); });
  return dropdown;
}

function createReminderElement(doc) {
  const data = doc.data();
  const remist = document.createElement("div");
  styleReminderElement(remist);
  const textSpan = document.createElement("span");
  textSpan.textContent = data.text;
  textSpan.style.flexGrow = "1";
  textSpan.style.whiteSpace = "normal";
  textSpan.style.backgroundColor = "var(--button-color)";
  remist.appendChild(textSpan);
  const difficultyDropdown = createDifficultyDropdown(data.difficulty, data.text);
  difficultyDropdown.dataset.docId = doc.id;
  const deletebutton = createDeleteButton(remist, doc);
  fetch("JS/audio.json")
    .then((res) => res.json())
    .then((audioData) => {
      const dropdown = createAudioDropdown(audioData, doc.id);
      remist.appendChild(dropdown);
      remist.appendChild(difficultyDropdown);
      remist.appendChild(deletebutton);
      let audioObj = null;
      if (dropdown.value) audioObj = new Audio(dropdown.value);
      let intervalId = setInterval(() => {
        if (dropdown.value) {
          if (audioObj) { audioObj.pause(); audioObj.currentTime = 0; }
          audioObj = new Audio(dropdown.value);
          audioObj.play();
        }
      }, 8000);
      remist.audioObj = audioObj;
      remist.intervalId = intervalId;
    })
    .catch(() => { remist.appendChild(difficultyDropdown); remist.appendChild(deletebutton); });
  return remist;
}

function styleReminderElement(remist) {
  remist.style.backgroundColor = "var(--button-color)";
  remist.style.padding = "15px";
  remist.style.fontFamily = "sans-serif";
  remist.style.fontSize = "large";
  remist.style.border = "1.5px solid black";
  remist.style.borderRadius = "5px";
  remist.style.margin = "5px";
  remist.style.display = "flex";
  remist.style.alignItems = "center";
  remist.style.gap = "10px";
}

async function loadReminders(container) {
  if (!user || !user.uid) return;
  const userMood = localStorage.getItem("userMood") || "fine";
  try {
    const q = query(collection(db, "reminders"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const remindersArr = [];
    snapshot.forEach((doc) => remindersArr.push(doc));
    remindersArr.sort((a, b) => {
      const diffA = a.data().difficulty.toLowerCase();
      const diffB = b.data().difficulty.toLowerCase();
      if (userMood === "tired") { if (diffA === "easy" && diffB !== "easy") return -1; if (diffA !== "easy" && diffB === "easy") return 1; }
      else if (userMood === "productive") { if (diffA === "hard" && diffB !== "hard") return -1; if (diffA !== "hard" && diffB === "hard") return 1; }
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    const fragment = document.createDocumentFragment();
    remindersArr.forEach((doc) => { const rem = createReminderElement(doc); fragment.appendChild(rem); });
    container.textContent = "";
    container.appendChild(fragment);
  } catch (error) { console.error(error); }
}
