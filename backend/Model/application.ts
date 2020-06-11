let mongooose = require('mongoose');
let applicationSchema = mongooose.Schema({
  id: String,
  status: String,
  module: Module,
  student: Student,
  responsible: String,
});

let Application = mongose.model('Module', applicationSchema);
module.exports = Module;
