const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  word: { type: String, unique: true, required: true },
  numOfTimes: { type: Number, default: 0 },
  translation: { default: { ru: '', eng: '' } },
})

module.exports = model('Word', schema)
