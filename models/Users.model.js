const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, reuqired: true },
  password: { type: String, reuqired: true },
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = { UserModel };
