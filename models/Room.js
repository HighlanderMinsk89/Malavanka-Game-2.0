const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  roomName: { type: String, required: true, unique: true },
  authorImage: { type: String },
  description: { type: String },
})

module.exports = model('Room', schema)
