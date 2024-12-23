const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Corrected the syntax for pre-save hook
User Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Corrected the syntax for instance method
User Schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Removed the extra space in the model name
module.exports = mongoose.model('User ', UserSchema);