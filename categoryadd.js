import { db } from "./Database/firebase.js";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const addBtn = document.getElementById("addBtn");
const categoryContainer = document.getElementById("catcontainer");
const notes = document.getElementById("notes-container");
const noNotes = document.getElementById("no-notes")
addBtn.style.backgroundColor = "var(--button-color)";
notes.style.display = "flex";
notes.style.gap = "20px";
notes.style.alignItems = "flex-start";

const categories = {};
const buttons = ["Personal", "Work", "School"];
const savedNotes = JSON.parse(localStorage.getItem("notesData")) || {};

for (const name in savedNotes) {
    if (!categories[name]) {
        const column = document.createElement("div");
        column.style.display = "flex";
        column.style.flexDirection = "column";
        column.style.gap = "10px";

        const title = document.createElement("h3");
        title.textContent = name;
        title.style.textAlign = "center";
        title.style.color = "var(--button-color)";
        column.appendChild(title);
        notes.appendChild(column);

        categories[name] = { column, count: 0 };
    }

    if(Object.keys(categories).length > 0) {
        noNotes.remove()
    }

    const data = categories[name];

    savedNotes[name].forEach(noteContent => {
        const card = createCard(name, noteContent, data);
        data.column.appendChild(card);
        data.count++;
    });
    refreshDeleteButtons(data);
}

addBtn.addEventListener("click", () => {
    noNotes.remove()
    categoryContainer.style.display = "block";
    categoryContainer.innerHTML = "";

    buttons.forEach(name => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.style.display = "block";
        btn.style.margin = "15px auto";
        btn.style.width = "200px";
        btn.style.height = "40px";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "var(--button-color)";
        categoryContainer.appendChild(btn);

        btn.addEventListener("click", async () => {
            if (!categories[name]) {
                const column = document.createElement("div");
                column.style.display = "flex";
                column.style.flexDirection = "column";
                column.style.gap = "10px";

                const title = document.createElement("h3");
                title.textContent = name;
                title.style.textAlign = "center";
                title.style.color = "var(--button-color)";
                title.style.fontFamily = "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode'";
                column.appendChild(title);
                notes.appendChild(column);

                categories[name] = { column, count: 0 };
            }

            const data = categories[name];

            if (data.count >= 3) {
                categoryContainer.style.display = "none";
                alert("Premium feature: more notes coming soon");
                return;
            }

            const card = createCard(name, "", data);
            data.column.appendChild(card);
            data.count++;
            refreshDeleteButtons(data);

            categoryContainer.style.display = "none";
        });
    });
});

function createCard(name, content = "", data) {
    const card = document.createElement("div");
    card.style.width = "220px";
    card.style.height = "150px";
    card.style.border = "2px solid var(--border-color)";
    card.style.borderRadius = "6px";
    card.style.padding = "6px";
    card.style.backgroundColor = "var(--button-color)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.position = "relative";

    const catName = document.createElement("input");
    catName.value = name;
    catName.readOnly = true;
    catName.style.border = "none";
    catName.style.background = "transparent";
    catName.style.color = "var(--text-color)";
    catName.style.fontWeight = "bold";
    catName.style.fontSize = "14px";

    const hr = document.createElement("hr");
    hr.style.border = "1px solid var(--border-color)";
    hr.style.margin = "2px 0 4px 0";

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.border = "none";
    textarea.style.resize = "none";
    textarea.style.outline = "none";
    textarea.style.background = "transparent";
    textarea.style.color = "var(--text-color)";

    textarea.addEventListener("input", () => {
        updateLocalStorage(name, data.column);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "5px";
    deleteBtn.style.right = "5px";
    deleteBtn.style.border = "2px solid var(--border-color)";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.background = "var(--button-color)";
    deleteBtn.style.color = "var(--text-color)";
    deleteBtn.style.display = data.count >= 3 ? "block" : "none";

    deleteBtn.addEventListener("click", () => {
        card.remove();
        data.count--;
        updateLocalStorage(name, data.column);
        refreshDeleteButtons(data);
    });

    card.appendChild(deleteBtn);
    card.appendChild(catName);
    card.appendChild(hr);
    card.appendChild(textarea);

    return card;
}

function updateLocalStorage(name, column) {
    const notesArray = [];
    column.querySelectorAll("textarea").forEach(textarea => {
        notesArray.push(textarea.value);
    });
    const current = JSON.parse(localStorage.getItem("notesData")) || {};
    current[name] = notesArray;
    localStorage.setItem("notesData", JSON.stringify(current));
}

function refreshDeleteButtons(data) {
    const cards = data.column.querySelectorAll("div");
    cards.forEach(card => {
        const btn = card.querySelector("button");
        if (btn) {
            btn.style.display = data.count >= 3 ? "block" : "none";
        }
    });


} 