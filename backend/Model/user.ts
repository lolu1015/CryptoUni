let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
  name: String,
  id: String,
  password: String,
  modules: [],
  currentModules: [],
  role: String
}, { collection: 'users' });
let User = mongoose.model('User', userSchema);
module.exports = User;
