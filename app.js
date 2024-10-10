const webhookURL = 'https://discord.com/api/webhooks/1293946715405156403/uXw38dP_NrdqGd05WwSE2yu4-9iV__13MRtgW0oDclit7d4vNln-GlG78jKJCZjEh1bd';  // Replace with your Discord webhook URL

let editingNoteId = null;

document.getElementById('save-btn')?.addEventListener('click', handleSaveNote);
document.getElementById('edit-btn')?.addEventListener('click', handleEditNote);
document.getElementById('search-input')?.addEventListener('input', searchNotes);
document.getElementById('new-note-btn')?.addEventListener('click', () => {
    window.location.href = 'edit.html'; // Redirect to edit page
});

// Save note and post to Discord and download
function handleSaveNote() {
    const note = getNoteFromInput();

    // Validate input
    if (!note.title.trim() || !note.text.trim()) {
        alert("Please enter both a title and some text for the note.");
        return; // Prevent saving if validation fails
    }

    addNoteToDOM(note);
    saveNoteToLocalStorage(note);
    sendNoteToDiscord(note);
    downloadNoteAsFile(note);
    clearInputFields();
}

// Edit a note
function handleEditNote() {
    const note = getNoteFromInput();
    note.id = editingNoteId;
    updateNoteInLocalStorage(note);
    loadNotes();
    clearInputFields();
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'inline';
}

function getNoteFromInput() {
    const noteTitle = document.getElementById('note-title') ? document.getElementById('note-title').innerText.trim() : 'Untitled';
    const noteText = document.getElementById('note-input').value.trim();
    const date = new Date().toLocaleString();
    return { id: Date.now(), title: noteTitle, text: noteText, date };
}

function addNoteToDOM(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.innerHTML = `
        <h3>${note.title}</h3>
        <div class="note-date">${note.date}</div>
        <p>${note.text}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">X</button>
    `;

    noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNoteInDOM(note));
    noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNoteFromDOM(noteDiv, note.id));
    document.getElementById('notes-container').appendChild(noteDiv);
}

function editNoteInDOM(note) {
    document.getElementById('note-input').value = note.text;
    editingNoteId = note.id;
    document.getElementById('save-btn').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'inline';
}

function saveNoteToLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteInLocalStorage(updatedNote) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.findIndex(note => note.id === updatedNote.id);
    notes[index] = updatedNote;
    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNoteFromDOM(noteDiv, noteId) {
    noteDiv.remove();
    deleteNoteFromLocalStorage(noteId);
}

function deleteNoteFromLocalStorage(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

function loadNotes() {
    document.getElementById('notes-container').innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(addNoteToDOM);
}

function sendNoteToDiscord(note) {
    const payload = {
        content: `**${note.title}**\n${note.text}\n*Created on ${note.date}*`
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.ok ? console.log('Note successfully sent to Discord') : console.error('Failed to send note to Discord'))
    .catch(error => console.error('Error:', error));
}

function downloadNoteAsFile(note) {
    const noteContent = `Title: ${note.title}\n\n${note.text}\n\nCreated on: ${note.date}`;
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${note.title}.txt`;
    downloadLink.click();
}

function clearInputFields() {
    document.getElementById('note-input').value = '';
}
