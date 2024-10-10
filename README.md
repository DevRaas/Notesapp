# Notes App

**Notes App** is a simple, mobile-friendly web application designed for note-taking with advanced features like Markdown support, note tagging, dark mode, and exporting notes. Notes are saved locally in the browser and can also be sent to a Discord webhook for backup or sharing.

## Features
- **Create, Edit, and Delete Notes**: Write and manage notes with ease.
- **Markdown Support**: Use basic Markdown syntax in your notes.
- **Note Categorization**: Tag your notes for better organization.
- **Search**: Quickly find notes using the search bar.
- **Download Notes**: Download notes as `.txt` files.
- **Discord Integration**: Send notes to a Discord channel via a webhook.
- **Dark Mode**: Toggle between light and dark modes.
- **Mobile-Friendly**: Responsive design, perfect for mobile use.

## Technologies Used
- **HTML5**: For structuring the app.
- **CSS3**: For responsive layout and dark/light theme support.
- **JavaScript (ES6)**: For interactive functionalities like note management, search, and integration with Discord webhook.
- **LocalStorage**: For persisting notes across sessions.
- **Discord Webhook API**: To send notes to Discord channels.

## How to Use

1. **Creating a Note**: Enter a title, note content (Markdown supported), and tags, then press the "Save" button. The note will be saved locally, sent to Discord, and available for download.
2. **Editing a Note**: Press the "Edit" button next to an existing note to update it.
3. **Searching Notes**: Type in the search box to filter notes by title, content, or tags.
4. **Dark Mode**: Use the "Toggle Theme" button to switch between dark and light modes.

## Installation and Setup

To use the app locally or host it on your own server, follow these steps:

### Prerequisites
- A web browser.
- A Discord Webhook URL if you want to send notes to Discord.

### Steps to Run Locally
1. Clone this repository:
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/advanced-notes-app.git
    ```

2. Open the `index.html` file in your web browser.

3. **(Optional)**: Replace the placeholder `YOUR_DISCORD_WEBHOOK_URL` in `app.js` with your own Discord Webhook URL if you wish to send notes to Discord.

### How to Host on GitHub Pages

1. Go to your GitHub account and navigate to the repository.

2. Click on the **Settings** tab in your repository.

3. Scroll down to the **"Pages"** section.

4. Under the **"Source"** section, choose `main` or `master` branch and set it to the `/ (root)` folder.

5. Click **Save**. GitHub Pages will now generate a public URL for your app (e.g., `https://your-username.github.io/advanced-notes-app/`).

6. Your app will now be live on the web!

## License
This project is licensed under the MIT License.
