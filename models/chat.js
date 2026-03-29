const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

    content:{
        type:String,
    },
    user:{
        type:String,
    },
    roomId:{
        type:String
    }

});

const chat = mongoose.model('chat',chatSchema);
module.exports = chat;