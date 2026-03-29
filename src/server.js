require("dotenv").config();
const express = require("express");
const path = require("path");
const connect = require('../config/database-cofig');
const http = require("http");
const socketio = require("socket.io");
const Chat = require('../models/chat');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

// Body parser for Join Form
app.use(express.urlencoded({ extended: true }));

let onlineUsers = {};

io.on("connection", (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
        if (!onlineUsers[data.roomId]) onlineUsers[data.roomId] = 0;
        onlineUsers[data.roomId]++;
        io.to(data.roomId).emit('room_stats', { count: onlineUsers[data.roomId] });
    });

    socket.on("msg_send", async (data) => {
        try {
            await Chat.create({ 
                roomId: data.roomId, 
                user: data.username, 
                content: data.msg || "", 
                image: data.img || null 
            });
            io.to(data.roomId).emit("msg_rcvd", data);
        } catch (err) { console.log(err); }
    });

    socket.on('clear_all_chats', async (data) => {
        try {
            await Chat.deleteMany({ roomId: data.roomId });
            io.to(data.roomId).emit('chat_cleared');
        } catch (err) { console.log(err); }
    });

    socket.on('typing', (data) => { socket.broadcast.to(data.roomId).emit('someone_typing'); });

    socket.on('disconnecting', () => {
        for (const room of socket.rooms) {
            if (onlineUsers[room]) {
                onlineUsers[room]--;
                io.to(room).emit('room_stats', { count: onlineUsers[room] });
            }
        }
    });
});

app.set('view engine', 'ejs');
app.use("/", express.static(path.join(__dirname, "..", "public")));

// Routes
app.get('/', (req, res) => { res.render('join'); });

app.post('/join', (req, res) => {
    const { roomId, password } = req.body;
    const SECRET_PASS = "1234"; // Yahan apna password set karein
    if (password === SECRET_PASS) {
        res.redirect(`/chat/${roomId}`);
    } else {
        res.send("<script>alert('Galat Password!'); window.location='/';</script>");
    }
});

app.get('/chat/:roomId', async (req, res) => {
    const chats = await Chat.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.render('index', { id: req.params.roomId, chats: chats });
});

server.listen(PORT, async () => {
    await connect();
    console.log(`Server on ${PORT} | MongoDB Connected.`);
});