const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  roomName: { type: String, required: true, unique: true },
  usersOnlineNum: { type: Number, default: 0, required: true },
  users: [],
  isPlaying: { type: Boolean, default: false },
  activeUser: { type: String, default: '' },
  word: { type: String, default: '' },
})

module.exports = model('Room', schema)
