const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  roomName: { type: String, required: true, unique: true },
  chatMessages: { type: Array, default: [], required: true },
  users: { type: Array, default: [], required: true },
})

module.exports = model('Room', schema)
