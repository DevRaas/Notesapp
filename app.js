const webhookURL = 'https://discord.com/api/webhooks/1293946715405156403/uXw38dP_NrdqGd05WwSE2yu4-9iV__13MRtgW0oDclit7d4vNln-GlG78jKJCZjEh1bd';  // Replace with your Discord webhook URL

// Rich text editor for both mobile and desktop
document.getElementById('bold-btn')?.addEventListener('click', () => document.execCommand('bold'));
document.getElementById('italic-btn')?.addEventListener('click', () => document.execCommand('italic'));
document.getElementById('underline-btn')?.addEventListener('click', () => document.execCommand('underline'));
document.getElementById('bullets-btn')?.addEventListener('click', () => document.execCommand('insertUnorderedList'));

// Font size change for both mobile and desktop
document.getElementById('font-size-select')?.addEventListener('change', (event) => {
    document.execCommand('fontSize', false, '7'); // execCommand only supports fontSize 1-7
    document.querySelectorAll("font[size='7']").forEach(el => {
        el.removeAttribute('size');
        el.style.fontSize = event.target.value + 'px';
    });
});

// Font color change for both mobile and desktop
document.getElementById('font-color-select')?.addEventListener('change', (event) => {
    document.execCommand('foreColor', false, event.target.value);
});

// Save Note for mobile and desktop (with Discord webhook)
document.getElementById('save-btn')?.addEventListener('click', saveNote);
document.getElementById('save-note')?.addEventListener('click', saveNote);

function saveNote() {
    const noteContent = document.getElementById('note-input')?.innerHTML.trim() || document.getElementById('editor')?.innerHTML.trim();
    
    if (!noteContent) {
        alert('Please enter some content before saving.');
        return;
    }

    // Send note to Discord webhook
    sendNoteToDiscord(noteContent);

    // Reset the input field/editor
    if (document.getElementById('note-input')) {
        document.getElementById('note-input').innerHTML = '';
    } else if (document.getElementById('editor')) {
        document.getElementById('editor').innerHTML = '';
    }

    alert('Note saved and sent to Discord!');
}

// Function to send the note content to Discord webhook
function sendNoteToDiscord(noteContent) {
    const payload = {
        content: `**New Note:**\n${noteContent}`
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
