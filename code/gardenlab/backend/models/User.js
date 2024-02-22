const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const gardenSchema = new mongoose.Schema({
  layout: [{
    plantId: String,
    position: {
      x: Number,
      y: Number
    }
  }],
  width: Number,
  height: Number
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  garden: gardenSchema
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
