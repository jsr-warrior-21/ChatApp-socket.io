const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Room", roomSchema);
