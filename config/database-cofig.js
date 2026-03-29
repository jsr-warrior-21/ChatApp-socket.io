const mongoose =require('mongoose');

const connect = async () =>{
    mongoose.connect('mongodb+srv://jsrarvind12_db_user:arvindMongo21@cluster3.ijrgsvj.mongodb.net/?appName=Cluster3')
}

module.exports = connect;