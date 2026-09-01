# ConnectSphere – Real-Time Communication Platform

ConnectSphere is a web-based real-time communication platform that supports video and audio meetings, in-room text messaging, Google-based authentication, and a collaborative whiteboard. The application uses WebRTC/PeerJS for peer-to-peer media communication and Socket.IO for real-time room events, chat, and whiteboard synchronization.

## Features

- 🎥 Real-time peer-to-peer video and audio communication
- 💬 Real-time meeting-room text chat
- 🖥️ Unique meeting rooms generated for new meetings
- 🔗 Join an existing meeting using a room URL
- 🔐 Google OAuth authentication using Passport
- 📝 Collaborative drawing whiteboard with pencil, eraser, and clear controls
- 🔄 Real-time synchronization of users, chat messages, and whiteboard actions
- 🎙️ Mute/unmute microphone control
- 📹 Start/stop video control
- 🚪 Leave meeting functionality

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO
- PeerJS / Express Peer Server
- Passport.js
- Google OAuth 2.0
- Express Session
- UUID
- EJS

### Frontend
- JavaScript
- HTML
- CSS
- EJS
- Bootstrap
- jQuery
- Font Awesome
- WebRTC through PeerJS

## Project Structure

```text
ConnectSphere/
├── public/
│   ├── script.js
│   ├── style.css
│   └── whiteBoardScript.js
├── views/
│   ├── home.ejs
│   ├── logout.ejs
│   ├── room.ejs
│   ├── whiteBoard.ejs
│   └── pages/
│       ├── auth.ejs
│       └── success.ejs
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## How It Works

1. The Express server renders the meeting and authentication pages using EJS.
2. A new meeting creates a unique room ID using UUID.
3. PeerJS establishes peer-to-peer audio/video connections between participants.
4. Socket.IO manages room events such as joining, leaving, user connection/disconnection, and chat messages.
5. The collaborative whiteboard uses a browser canvas and Socket.IO events to synchronize drawing, erasing, and clearing actions between connected clients.
6. Passport.js handles Google authentication and maintains user sessions.

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- A modern web browser with camera and microphone support
- A Google Cloud project with OAuth 2.0 credentials for Google Sign-In

## Installation

Clone the repository and move into the project directory:

```bash
git clone <your-repository-url>
cd ConnectSphere
```

Install the project dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Google OAuth Configuration

The application currently uses the following callback URL:

```text
http://localhost:3030/auth/google/callback
```

Add this URL to the authorized redirect URIs of your Google OAuth client.

## Running the Application

Start the server with:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The application runs by default at:

```text
http://localhost:3030
```

## Using the Application

### Create a Meeting

Open the application and choose **New Meeting**. A unique meeting room is generated automatically.

### Join a Meeting

Enter an existing meeting URL in the join field and open the generated room.

### During a Meeting

Participants can:

- Enable/disable their microphone
- Start/stop their camera
- Open or hide the chat panel
- Send real-time text messages
- Open the collaborative whiteboard
- Leave the meeting

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `PORT` | Optional server port; defaults to `3030` |

## Notes

- Camera and microphone permissions are required for video meetings.
- The current Google OAuth callback is configured for local development at `localhost:3030`.
- No database is used in the current implementation.
- Do not commit your `.env` file or OAuth secrets to Git.
- For deployment, the Google OAuth callback configuration and other localhost-specific settings need to be updated for the deployed domain.

## License

This project is provided for educational and personal project use.
