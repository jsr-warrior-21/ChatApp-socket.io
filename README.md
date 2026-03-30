# Talkify — Real-Time Private Messenger

Talkify is a high-performance, full-stack chat application designed for instant and secure communication. It eliminates the friction of traditional sign-up processes, allowing users to create private rooms and start chatting immediately.

## Key Features

- **Private Rooms:** Create secure chat spaces protected by unique IDs and passwords.
- **Real-Time Messaging:** Instant data synchronization and sub-second message delivery powered by Socket.io.
- **Smart Image Compression:** Integrated client-side processing that reduces image sizes by up to 90% before upload, ensuring lightning-fast sharing even on slow networks.
- **Responsive Design:** A modern Glassmorphism UI with seamless Dark and Light mode support.
- **24/7 Availability:** Optimized deployment on Render with a custom automated keep-alive system to prevent server sleep cycles.

## Tech Stack

- **Frontend:** EJS (Embedded JavaScript templates), CSS3 (Flexbox/Grid), Vanilla JavaScript.
- **Backend:** Node.js, Express.js.
- **Real-Time Engine:** Socket.io (WebSockets).
- **Database:** MongoDB (via Mongoose).

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- MongoDB Atlas account or local MongoDB setup.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/jsr-warrior-21/ChatApp-socket.io.git](https://github.com/jsr-warrior-21/ChatApp-socket.io.git)
2. Install dependencies :

npm install

4. Create a .env file in the root directory and add your credentials:

PORT=3000
MONGO_URI=your_mongodb_connection_string

4.Start the server:

npm start

5: Open http://localhost:3000 in your browser.

Experience the app live here: https://talkify-hpb2.onrender.com/
   
