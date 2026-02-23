const notesInput = document.getElementById('dumbnotes');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('savedumb');

// Load notes from localStorage on page load
function loadSavedNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('dumb-notes')) || [];
  notesContainer.innerHTML = ''; // Clear container before loading

  savedNotes.forEach(noteText => {
    const noteDiv = document.createElement('div');
    noteDiv.textContent = noteText;
    noteDiv.style.whiteSpace = 'pre-wrap';
    noteDiv.style.backgroundColor = 'var(--button-color)';
    noteDiv.style.fontFamily = 'Verdana, Geneva, Tahoma, sans-serif';
    noteDiv.style.padding = '5px';
    noteDiv.style.fontWeight = 'bolder';
    notesContainer.appendChild(noteDiv);
  });
}

// Save notes array to localStorage
function saveNotes(notes) {
  localStorage.setItem('dumb-notes', JSON.stringify(notes));
}

addNoteBtn.addEventListener('click', () => {
  const noteText = notesInput.value.trim();
  if (!noteText) {
    alert("Empty note");
    return;  // Stop further execution if empty
  }

  // Get current notes from localStorage
  const savedNotes = JSON.parse(localStorage.getItem('dumb-notes')) || [];

  // Add new note to the array
  savedNotes.push(noteText);

  // Save updated notes array back to localStorage
  saveNotes(savedNotes);

  // Add the new note to the DOM
  const noteDiv = document.createElement('div');
  noteDiv.textContent = noteText;
  noteDiv.style.whiteSpace = 'pre-wrap';
  noteDiv.style.backgroundColor = 'var(--button-color)';
  noteDiv.style.fontFamily = 'Verdana, Geneva, Tahoma, sans-serif';
  noteDiv.style.padding = '5px';
  noteDiv.style.fontWeight = 'bolder';
  notesContainer.appendChild(noteDiv);

  // Clear the input field
  notesInput.value = '';
});

// Load notes when the page loads
loadSavedNotes();
