require("dotenv").config();
const express = require("express");
const path = require("path");
const connect = require('../config/database-cofig');
const http = require("http");
const socketio = require("socket.io");
const Chat = require('../models/chat');
const Room = require('../models/room'); 

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use("/", express.static(path.join(__dirname, "..", "public")));

let onlineUsers = {};

io.on("connection", (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
        socket.currentRoom = data.roomId;
        
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

    // --- CLEAR HISTORY LOGIC (Wapas Add Kar Diya) ---
    socket.on('clear_all_chats', async (data) => {
        try {
            await Chat.deleteMany({ roomId: data.roomId });
            io.to(data.roomId).emit('chat_cleared');
            console.log(`History cleared for Room: ${data.roomId}`);
        } catch (err) { console.log(err); }
    });

    socket.on('typing', (data) => { socket.broadcast.to(data.roomId).emit('someone_typing'); });

    socket.on('disconnect', async () => {
        const room = socket.currentRoom;
        if (room && onlineUsers[room]) {
            onlineUsers[room]--;
            
            setTimeout(async () => {
                if (onlineUsers[room] <= 0) {
                    try {
                        await Chat.deleteMany({ roomId: room }); 
                        await Room.deleteOne({ roomId: room });  
                        delete onlineUsers[room];
                        console.log(`Auto-Cleanup: Room ${room} deleted.`);
                    } catch (err) { console.log("Cleanup Error:", err); }
                } else {
                    io.to(room).emit('room_stats', { count: onlineUsers[room] });
                }
            }, 2000); 
        }
    });
});

// --- ROUTES ---
app.get('/', (req, res) => { res.render('join'); });

app.post('/join', async (req, res) => {
    const { roomId, password, username } = req.body;
    try {
        let room = await Room.findOne({ roomId: roomId.trim() });

        if (!room) {
            await Room.create({ roomId: roomId.trim(), password: password.trim() });
            return res.redirect(`/chat/${roomId}?name=${encodeURIComponent(username)}&new=true`);
        } else {
            if (String(room.password) === String(password)) {
                return res.redirect(`/chat/${roomId}?name=${encodeURIComponent(username)}`);
            } else {
                return res.send("<script>alert('Wrong Password! Room ID  already busy.'); window.location='/';</script>");
            }
        }
    } catch (err) { res.status(500).send("Server Error"); }
});

app.get('/chat/:roomId', async (req, res) => {
    try {
        const chats = await Chat.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
        res.render('index', { 
            id: req.params.roomId, 
            chats: chats, 
            userName: req.query.name || "Guest",
            isNew: req.query.new || false 
        });
    } catch (err) { res.status(500).send("Database Error"); }
});

server.listen(PORT, async () => {
    await connect();
    console.log(`Server on ${PORT} | MongoDB Connected.`);
});