# Music Sync 🎵

A real-time collaborative music room application built using **Node.js**, **Express**, and **Socket.IO**.

Users can create rooms, join shared listening sessions, chat in real time, manage a song queue, and synchronize playback state across all connected participants.

---

## Features

### Room Management

* Create music rooms
* Join existing rooms
* Unique room IDs
* Multiple users per room

### Host System

* First user becomes host automatically
* Host transfer when current host leaves
* Host-only playback controls
* Host-only queue management

### Real-Time Synchronization

* Play / Pause synchronization
* Seek synchronization
* Current song synchronization
* Late join state recovery
* Automatic room-wide state updates

### Queue Management

* Add songs to queue
* Remove songs from queue
* Queue updates broadcast to all users
* Automatic next-song playback

### Chat System

* Real-time room chat
* Message broadcasting using Socket.IO
* Timestamped messages

### User Presence

* Live user list
* Join notifications
* Leave notifications
* Host status updates

---

## Tech Stack

### Backend

* Node.js
* Express.js
* Socket.IO

### Frontend

* HTML
* CSS
* JavaScript

### Data Storage

* In-memory room management using JavaScript Maps

---

## Project Structure

```text
project-root/

├── controllers/
├── routes/
├── sockets/
│   └── roomSockets.js
│
├── services/
│   ├── roomStore.js
│   └── socketStore.js
│
├── utils/
│   └── generateRoomID.js
│
├── frontend/
│   ├── index.html
│   ├── room.html
│   ├── css/
│   └── js/
│
├── app.js
├── server.js
└── package.json
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd music-sync
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

Frontend can be served using VS Code Live Server.

---

## How It Works

### Create Room

```text
User
 ↓
Create Room
 ↓
Server Generates Room ID
 ↓
Room Created
```

### Join Room

```text
User
 ↓
Join Room
 ↓
Socket Connection
 ↓
Room Broadcast
```

### Playback Sync

```text
Host
 ↓
Play / Pause / Seek
 ↓
Server Updates Room State
 ↓
Broadcast To Room
 ↓
All Clients Sync
```

### Auto Next Song

```text
Song Ends
 ↓
Server Picks Next Song
 ↓
Queue Updated
 ↓
Playback Continues
```

---

## Future Improvements

* Invite links
* Persistent storage using MongoDB
* Redis pub/sub
* Real audio playback
* Vote to skip
* Room locking
* Playback drift correction
* Authentication and user profiles
* Deployment using Docker

---

## Learning Outcomes

This project demonstrates:

* WebSocket communication
* Real-time synchronization
* Event-driven architecture
* Room-based Socket.IO communication
* State management
* Host election and transfer
* Queue processing
* Real-time chat systems

---

## Author

Ajeet Kumar

Built as a learning project to explore real-time distributed application concepts using Socket.IO and Node.js.
