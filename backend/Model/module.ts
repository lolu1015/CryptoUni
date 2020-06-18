let mongose = require('mongoose');
let moduleSchema = mongose.Schema({
  name: String,
  id: String,
  professor: String,
  description: String,
  module: String,
  grade: Number
});

let Module = mongose.model('Module', moduleSchema);
module.exports = Module;
