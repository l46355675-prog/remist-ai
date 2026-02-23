import { auth, db } from "./Database/firebase.js";
import { collection, getDocs, query, where, deleteDoc, doc as docRef } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const container = document.getElementById("weekly-review");
const displayHardCount = document.getElementById("hardtasks");
    const displayEasyCount = document.getElementById("easytasks");

onAuthStateChanged(auth, user => {
  if (!user) {
    container.innerHTML = "Please log in to see your tasks.";
    return;
  }

  async function loadHistory() {
    let hardCount = 0
    let easyCount = 0;
    
    const remindersRef = collection(db, "remindersHistory"); // changed to history
    const q = query(remindersRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    container.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      if (!data.date) return;

      const taskDate = new Date(data.date);

      if (taskDate >= oneWeekAgo) {
        const li = document.createElement("li");
        const weekday = taskDate.toLocaleDateString('en-US', { weekday: "long" });

        // exactly like your code
        li.textContent = `${weekday}: Task: ${data.text},  [ ${data.difficulty} ]`;
        li.style.margin = "5px"
        li.style.color = "var(--text-color)"
        container.appendChild(li);
        container.style.color = "var(--button-color)"
        if(data.difficulty === "hard") {
        hardCount++;
        displayHardCount.textContent = hardCount
    } else {
        easyCount++;
        displayEasyCount.textContent = easyCount
    }
      }
    });
  }

  loadHistory();

  const clearBtn = document.getElementById("delete");

clearBtn.addEventListener("click", async () => {
  if (!user) return;

  try {
    const q = query(
      collection(db, "remindersHistory"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(async (docu) => {
      await deleteDoc(docRef(db, "remindersHistory", docu.id));
    });

    container.innerHTML = "";
    displayHardCount.textContent = "0";
    displayEasyCount.textContent = "0"; // clear page instantly

  } catch (err) {
    console.error("Failed to clear history:", err);
  }
});



});
