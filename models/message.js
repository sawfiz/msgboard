const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: String, required: true, maxLength: 30 },
  text: { type: String, required: true, maxLength: 400 },
  added: { type: Date },
});

// Export model called Message based on the MessageSchema
module.exports = mongoose.model("Message", MessageSchema);
