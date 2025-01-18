const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
