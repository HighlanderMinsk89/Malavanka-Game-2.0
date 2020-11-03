const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  roomName: { type: String, required: true, unique: true },
  usersOnline: { type: Number, default: 0, required: true },
})

module.exports = model('Room', schema)
