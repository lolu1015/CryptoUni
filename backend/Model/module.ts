let mongose = require('mongoose');
let moduleSchema = mongose.Schema({
  name: String,
  id: String,
  professor: String,
  description: String
});

let Module = mongose.model('Module', moduleSchema);
module.exports = Module;
