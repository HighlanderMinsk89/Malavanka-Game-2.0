const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  score: { type: Number },
  location: { type: String },
});

module.exports = model("User", schema);
