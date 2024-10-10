const webhookURL = 'https://discord.com/api/webhooks/1293946715405156403/uXw38dP_NrdqGd05WwSE2yu4-9iV__13MRtgW0oDclit7d4vNln-GlG78jKJCZjEh1bd'; // Replace with your Discord webhook URL

let editingNoteId = null;

document.getElementById('save-btn').addEventListener('click', handleSaveNote);
document.getElementById('edit-btn').addEventListener('click', handleEditNote);
document.getElementById('search-input').addEventListener('input', searchNotes);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Fetch suggestions from Datamuse API
async function fetchSuggestions(word) {
    const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
    const suggestions = await response.json();
    return suggestions.map(s => s.word);
}

// Perform autocorrect
async function autocorrect(input) {
    const words = input.split(' ');
    const correctedWords = [];

    for (const word of words) {
        const suggestions = await fetchSuggestions(word);
        correctedWords.push(suggestions.length > 0 ? suggestions[0] : word);
    }
    return correctedWords.join(' ');
}

// Save note and post to Discord and download
async function handleSaveNote() {
    const note = await getNoteFromInput(); // Await the autocorrect functionality

    if (note.text) {
        addNoteToDOM(note);
        saveNoteToLocalStorage(note);
        sendNoteToDiscord(note);
        downloadNoteAsFile(note);
        clearInputFields();
    }
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

async function getNoteFromInput() {
    const noteTitle = document.getElementById('note-title').value.trim() || 'Untitled';
    const noteText = document.getElementById('note-input').value.trim();
    const noteTags = document.getElementById('note-tags').value.trim().split(',').map(tag => tag.trim());
    const date = new Date().toLocaleString();
    
    // Perform autocorrect on note text
    const correctedText = await autocorrect(noteText); // Await the autocorrect function

    return { id: Date.now(), title: noteTitle, text: correctedText, tags: noteTags, date };
}

function addNoteToDOM(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.innerHTML = `
        <h3>${note.title}</h3>
        <div class="note-date">${note.date}</div>
        <p>${note.text}</p>
        <div class="tags">Tags: ${note.tags.join(', ')}</div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">X</button>
    `;

    noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNoteInDOM(note));
    noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNoteFromDOM(noteDiv, note.id));
    document.getElementById('notes-container').appendChild(noteDiv);
}

function editNoteInDOM(note) {
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-input').value = note.text;
    document.getElementById('note-tags').value = note.tags.join(', ');
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

function searchNotes(event) {
    const searchText = event.target.value.toLowerCase();
    const notes = document.querySelectorAll('.note');
    
    notes.forEach(note => {
        const noteTitle = note.querySelector('h3').textContent.toLowerCase();
        const noteText = note.querySelector('p').textContent.toLowerCase();
        const tags = note.querySelector('.tags').textContent.toLowerCase();

        if (noteTitle.includes(searchText) || noteText.includes(searchText) || tags.includes(searchText)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
}

function sendNoteToDiscord(note) {
    const payload = {
        content: `**${note.title}**\n${note.text}\n*Tags: ${note.tags.join(', ')}*\n*Created on ${note.date}*`
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
    const noteContent = `Title: ${note.title}\n\n${note.text}\n\nTags: ${note.tags.join(', ')}\nCreated on: ${note.date}`;
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${note.title}.txt`;
    downloadLink.click();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function clearInputFields() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-input').value = '';
    document.getElementById('note-tags').value = '';
}

document.addEventListener('DOMContentLoaded', loadNotes);
