require("dotenv").config();
const express = require("express");
const path = require("path"); // 1. Added the built-in path module

const app = express();
const PORT = process.env.PORT || 3000; // 2. Added a fallback in case PORT is undefined
/**
 * path.join correctly handles the "step back" from /src to the root folder
 * then moves forward into /public.
 */



//setting up socketio from here

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app); // here we are passing express app in server thats why i am calling in bottom server.listen()
const io = socketio(server);
 
io.on('connection',(socket)=>{
    console.log('a user connected.',socket.id)

        // listening messege from the client side --> using socket.on
        
    socket.on('from_client',()=>{
        console.log("event comming from client.")
    })


    // sever  (to)---> client 
    setInterval(() => {
        socket.emit('from_server');
    }, 2000);







});

// const socket = io();  paste this in scrip.js which is using in the index.html


// ----> after pasting you will see that every time when any one going on that localhost endpoint from any browser on same machin you will see a new id will be created(see in the console.)


app.use('/', express.static(path.join(__dirname, '..', 'public')));

//-----> IMP---> here we will use server.listen instead of app.listen because of socket.io
server.listen(PORT, () => {
  console.log(`Server Started On The PORT : ${PORT}`);
});