const { Schema, model } = require('mongoose')

const schema = new Schema({
  author: String,
  room: Schema.Types.ObjectId,
  word: { type: String, unique: true, required: true },
  word_ru: { type: String },
  word_en: { type: String },
  numOfTimesGuessedCorrect: { type: Number, default: 0 },
  numOfTimesNobodyGuessedCorrect: { type: Number, default: 0 },
})

module.exports = model('Word', schema)
